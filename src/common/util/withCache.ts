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
    storage: IDBCacheStorage<T>;
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
            return cache.value;
        }

        const value = await f();
        storage.set(cacheName, value);
        return value;
    };

    func.storage = storage;

    return func;
}
