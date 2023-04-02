/**
 * ランダムな文字列を生成する
 *
 * @param length - 生成する文字列の長さ
 * @returns ランダムな文字列
 */
export function makeRandomString(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
