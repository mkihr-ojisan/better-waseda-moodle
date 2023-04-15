import { IDBCacheStorage } from "./CacheStorage";

export type CachedOptions = {
    /** キャッシュの有効期限。デフォルトは1日 */
    cacheTtlMs?: number;
};

/**
 * キャッシュされた値を返す関数を返す
 *
 * @param cacheName - キャッシュストレージの名前
 * @param dbVersion - キャッシュストレージのバージョン。`f`が返す値が変わったらバージョンを上げる
 * @param f - 値を生成する関数
 * @param options - オプション
 * @returns 関数
 */
export function cached<T>(
    cacheName: string,
    dbVersion: number,
    f: () => Promise<T>,
    options?: CachedOptions
): () => Promise<T> {
    const cacheTtlMs = options?.cacheTtlMs ?? 1000 * 60 * 60 * 24;

    const storage = new IDBCacheStorage<T>(cacheName, cacheTtlMs, dbVersion, 1);

    return async function () {
        const cache = await storage.get(cacheName);
        if (cache) {
            return cache.value;
        }

        const value = await f();
        storage.set(cacheName, value);
        return value;
    };
}
