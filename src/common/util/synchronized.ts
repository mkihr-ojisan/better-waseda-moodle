/**
 * 同時に複数回実行されないようにする
 *
 * @param f - 関数
 * @returns 同時に複数回実行されないようにした関数
 */
export function synchronized<T extends unknown[], R>(f: (...args: T) => Promise<R>): (...args: T) => Promise<R> {
    let promise: Promise<R> | null = null;
    return async (...args: T) => {
        if (promise) {
            await promise;
        }
        promise = (async () => {
            const result = await f(...args);
            promise = null;
            return result;
        })();
        return promise;
    };
}
