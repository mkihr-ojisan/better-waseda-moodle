/**
 * 指定された関数で評価された最小値を持つ要素を返す。
 *
 * @param array - 配列
 * @param f - 配列の各値から評価値を生成する関数
 * @returns 評価値が最小の要素のインデックス。配列が空の場合は -1
 */
export function minByKey<T>(array: T[], f: (item: T, index: number) => number): number {
    let min = Infinity;
    let minIndex = -1;
    for (let i = 0; i < array.length; i++) {
        const value = f(array[i], i);
        if (value < min) {
            min = value;
            minIndex = i;
        }
    }
    return minIndex;
}

/**
 * 配列内で重複する要素を削除した配列を返す。
 *
 * @param array - 配列
 * @returns 重複を削除した配列
 */
export function unique<T>(array: T[]): T[] {
    return array.filter((item, index) => array.indexOf(item) === index);
}
