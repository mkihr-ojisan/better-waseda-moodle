import { sleep } from "./sleep";

/**
 * 関数が一定時間に一度しか呼び出されないようにする
 *
 * @param limit_ms - 間隔（ミリ秒）
 * @param f - 関数
 * @returns 一定時間に一度しか呼び出されないようにされた関数
 */
export function limitRate<A extends unknown[], R>(
    limit_ms: number,
    f: (...args: A) => Promise<R>
): (...args: A) => Promise<R> {
    let lastCall = 0;
    return async (...args: A) => {
        const now = Date.now();
        if (now - lastCall < limit_ms) {
            await sleep(limit_ms - (now - lastCall));
        }
        lastCall = Date.now();
        return f(...args);
    };
}
