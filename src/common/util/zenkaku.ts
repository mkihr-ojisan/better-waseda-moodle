/**
 * 全角文字を半角文字に変換する。
 *
 * @param str - 全角文字を含む文字列
 * @returns 半角文字に変換された文字列
 */
export function zenkaku2hankaku(str: string): string {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}
