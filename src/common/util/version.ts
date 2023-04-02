/**
 * 0.0.0形式のバージョン文字列を比較する
 *
 * @param a -  1つめのバージョン文字列
 * @param b - 2つめのバージョン文字列
 * @returns a &lt; bなら-1、a &gt; bなら1、a == bなら0
 */
export function compareVersion(a: string, b: string): number {
    const aParts = a.split(".");
    const bParts = b.split(".");
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = parseInt(aParts[i] || "0");
        const bPart = parseInt(bParts[i] || "0");
        if (aPart < bPart) {
            return -1;
        } else if (aPart > bPart) {
            return 1;
        }
    }
    return 0;
}
