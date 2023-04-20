import equal from "fast-deep-equal";

/**
 * 同時に同じ引数で複数回呼び出された時に同一のPromiseを返す関数を作成する。なんて名前つけたらいいかわかんない
 *
 * @param f - 関数
 * @param argsComparator - 引数の比較関数。`true`を返した場合、同一の引数とみなす。
 * @returns 同一の引数で複数回呼び出された時に同一のPromiseを返す関数
 */
export function combinePromise<A extends unknown[], R>(
    f: (...args: A) => Promise<R>,
    argsComparator?: (oldArgs: A | null, newArgs: A) => boolean
): (...args: A) => Promise<R> {
    let promise: Promise<R> | null = null;
    let prevArgs: A | null = null;
    const comparator = argsComparator ?? equal;
    return (...args: A) => {
        if (promise && comparator(prevArgs, args)) {
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
