import { combinePromise } from "./combine-promise";
import { assertExtensionContext } from "./context";

assertExtensionContext("background");

/**
 * キャッシュ用のIndexedDBのバージョンを拡張機能のバージョンから生成する。
 *
 * @returns IndexedDBのバージョン
 */
function dbVersion(): number {
    const extensionVersion = chrome.runtime.getManifest().version;
    const split = extensionVersion.split(".");
    const version = parseInt(split[0], 10) * 10000 + parseInt(split[1], 10) * 100 + parseInt(split[2], 10);
    return version;
}

/** キャッシュ用のストレージを管理するクラス。 */
export class IDBCacheStorage<T> {
    /**
     * データベース。
     * ```
     * db: {
     *     cache: { key: IDBValidKey, value: T }[],
     *     timestamp: { key: IDBValidKey, timestamp: Date }[],
     * }
     * ```
     * みたいな感じ
     */
    private db: IDBDatabase | null = null;

    /**
     * @param storageId - ストレージを識別する識別子。
     * @param ttlMs - キャッシュの有効期限（ミリ秒）。
     * @param maxEntries - キャッシュの最大数。undefined なら無制限。
     */
    constructor(
        public readonly storageId: string,
        public readonly ttlMs: number,
        public readonly maxEntries?: number
    ) {}

    private init = combinePromise(
        () =>
            new Promise<void>((resolve, reject) => {
                if (this.db) {
                    resolve();
                    return;
                }

                const openRequest = indexedDB.open(this.storageId, dbVersion());
                openRequest.onupgradeneeded = (ev) => {
                    // バージョンが変わったらキャッシュを削除する
                    const db = openRequest.result;
                    if (ev.oldVersion !== 0) {
                        db.deleteObjectStore("cache");
                        db.deleteObjectStore("timestamp");
                    }
                    db.createObjectStore("cache", { keyPath: "key" });
                    db.createObjectStore("timestamp", { keyPath: "key" });
                };
                openRequest.onsuccess = () => {
                    this.db = openRequest.result;
                    resolve();
                };
                openRequest.onerror = () => {
                    reject(openRequest.error);
                };
            })
    );

    /**
     * キャッシュが存在し、有効期限内であれば値を返す。そうでなければ undefined を返す。
     *
     * @param key - キャッシュのキー
     */
    async get(key: IDBValidKey): Promise<{ value: T; timestamp: Date } | undefined> {
        if (!this.db) {
            await this.init();
        }

        const transaction = this.db!.transaction(["timestamp", "cache"], "readwrite");

        const timestamp: Date | undefined = await new Promise<Date | undefined>((resolve, reject) => {
            const store = transaction.objectStore("timestamp");
            const request = store.get(key);
            request.onsuccess = () => {
                resolve(request.result?.timestamp);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });

        if (!timestamp) {
            return undefined;
        }

        // 有効期限が切れたキャッシュは削除する
        if (Date.now() - timestamp.getTime() > this.ttlMs) {
            const timestampStore = transaction.objectStore("timestamp");
            const cacheStore = transaction.objectStore("cache");
            timestampStore.delete(key);
            cacheStore.delete(key);

            return undefined;
        }

        const value = await new Promise<T | undefined>((resolve, reject) => {
            const store = transaction.objectStore("cache");
            const request = store.get(key);
            request.onsuccess = () => {
                resolve(request.result?.value);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });

        return value ? { value, timestamp } : undefined;
    }

    /**
     * キャッシュを保存する。maxEntries が超える場合は古いものから削除する。
     *
     * @param key - キャッシュのキー
     * @param value - キャッシュの値
     * @param timestamp - キャッシュのタイムスタンプ。指定しなければ現在時刻。
     */
    async set(key: IDBValidKey, value: T, timestamp?: Date): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        timestamp ??= new Date();

        const transaction = this.db!.transaction(["timestamp", "cache"], "readwrite");
        const timestampStore = transaction.objectStore("timestamp");
        const cacheStore = transaction.objectStore("cache");
        timestampStore.put({ key, timestamp });
        cacheStore.put({ key, value });

        if (this.maxEntries !== undefined) {
            const count = await new Promise<number>((resolve, reject) => {
                const request = timestampStore.count();
                request.onsuccess = () => {
                    resolve(request.result);
                };
                request.onerror = () => {
                    reject(request.error);
                };
            });

            // 最大数を超える場合は最も古いものを1つ削除する
            if (count > this.maxEntries) {
                await new Promise<void>((resolve, reject) => {
                    const index = timestampStore.index("timestamp");
                    const request = index.openCursor(null, "next");
                    request.onsuccess = () => {
                        const cursor = request.result;
                        if (cursor) {
                            timestampStore.delete(cursor.primaryKey);
                            cacheStore.delete(cursor.primaryKey);
                            resolve();
                        } else {
                            reject(new Error("Cursor is null"));
                        }
                    };
                    request.onerror = () => {
                        reject(request.error);
                    };
                });
            }
        }

        return new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }

    /** キャッシュをクリアする。 */
    async clear(): Promise<void> {
        if (!this.db) {
            await this.init();
        }

        const transaction = this.db!.transaction(["timestamp", "cache"], "readwrite");
        const timestampStore = transaction.objectStore("timestamp");
        const cacheStore = transaction.objectStore("cache");
        timestampStore.clear();
        cacheStore.clear();

        return new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }
}
