/**
 * 指定ミリ秒待機する
 *
 * @param ms - 待機するミリ秒
 * @returns 待機が終了したら resolve する Promise
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
