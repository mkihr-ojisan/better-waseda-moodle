import equal from "fast-deep-equal";

/**
 * 同時に同じ引数で複数回呼び出された時に同一のPromiseを返す関数を作成する。なんて名前つけたらいいかわかんない
 *
 * @param f - 関数
 * @returns 同一の引数で複数回呼び出された時に同一のPromiseを返す関数
 */
export function combinePromise<A extends unknown[], R>(f: (...args: A) => Promise<R>): (...args: A) => Promise<R> {
    let promise: Promise<R> | null = null;
    let prevArgs: A | null = null;
    return (...args: A) => {
        if (promise && equal(args, prevArgs)) {
            return promise;
        }
        promise = f(...args);
        prevArgs = args;
        promise.finally(() => {
            promise = null;
            prevArgs = null;
        });
        return promise;
    };
}
