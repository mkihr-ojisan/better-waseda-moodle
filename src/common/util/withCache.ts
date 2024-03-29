import { IDBCacheStorage } from "./CacheStorage";

export type WithCacheOptions = {
    /** キャッシュの有効期限。デフォルトは1ヶ月 */
    cacheTtlMs?: number;
    /** この値より新しいキャッシュが存在する場合は関数を呼び出さない。デフォルトは1時間 */
    callIntervalMs?: number;
};

export type WithCache<T> = (() => AsyncGenerator<T>) & {
    invalidateCache: () => Promise<void>;
    promise: () => Promise<T>;
    storage: IDBCacheStorage<T> | undefined;
};

/**
 * キャッシュをyieldする非同期ジェネレーターを返す
 *
 * @param cacheName - キャッシュストレージの名前
 * @param dbVersion - キャッシュストレージのバージョン。`f`が返す値が変わったらバージョンを上げる
 * @param f - 値を生成する関数
 * @param options - オプション
 * @returns 非同期ジェネレーター
 */
export function withCache<T>(
    cacheName: string,
    dbVersion: number,
    f: () => Promise<T>,
    options?: WithCacheOptions
): WithCache<T> {
    const cacheTtlMs = options?.cacheTtlMs ?? 1000 * 60 * 60 * 24 * 30;
    const callIntervalMs = options?.callIntervalMs ?? 1000 * 60 * 60;

    const storage = new IDBCacheStorage<T>(cacheName, cacheTtlMs, dbVersion, 1);

    const func = async function* () {
        const cache = await storage.get(cacheName);
        if (cache) {
            yield cache.value;
        }

        if (cache && Date.now() - cache.timestamp.getTime() < callIntervalMs) {
            return;
        }

        const value = await f();
        storage.set(cacheName, value);
        yield value;
    };

    func.invalidateCache = async () => {
        await storage.clear();
    };

    func.promise = async () => {
        const cache = await storage.get(cacheName);
        if (cache) {
            if (Date.now() - cache.timestamp.getTime() >= callIntervalMs) {
                (async () => {
                    const value = await f();
                    storage.set(cacheName, value);
                })();
            }

            return cache.value;
        }

        const value = await f();
        storage.set(cacheName, value);
        return value;
    };

    func.storage = storage;

    return func;
}

/**
 * 配列を返すWithCacheの返り値を連結する
 *
 * @param withCaches - 連結するWithCache
 * @returns 連結したWithCache
 */
export function concatWithCache<T>(withCaches: WithCache<readonly T[]>[]): WithCache<readonly T[]> {
    const func = async function* () {
        const generators = withCaches.map((w) => w());
        const values = new Array(withCaches.length);
        const yielded = new Array(withCaches.length).fill(false);

        const nextFn = async (i: number) => ({
            i,
            next: await generators[i].next(),
        });

        const promises: (
            | Promise<{
                  i: number;
                  next: IteratorResult<readonly T[]>;
              }>
            | undefined
        )[] = generators.map((_, i) => nextFn(i));

        while (promises.some((v) => !!v)) {
            const { i, next } = await Promise.race(
                promises.filter((p): p is Promise<{ i: number; next: IteratorResult<readonly T[]> }> => !!p)
            );

            if (next.done) {
                promises[i] = undefined;
            } else {
                values[i] = next.value;
                promises[i] = nextFn(i);
                yielded[i] = true;

                if (yielded.every((v) => v)) {
                    yield values.flat();
                }
            }
        }
    };

    func.invalidateCache = async () => {
        await Promise.all(withCaches.map((w) => w.invalidateCache()));
    };

    func.promise = async () => {
        return (await Promise.all(withCaches.map((w) => w.promise()))).flat();
    };

    func.storage = undefined as IDBCacheStorage<T[]> | undefined;

    return func;
}

/**
 * キャッシュを持たないWithCacheを返す
 *
 * @param f - 値を生成する関数
 * @returns WithCache
 */
export function noopWithCache<T>(f: () => Promise<T>): WithCache<T> {
    const func = async function* () {
        yield await f();
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    func.invalidateCache = async () => {};

    func.promise = f;

    func.storage = undefined as IDBCacheStorage<T> | undefined;

    return func;
}
