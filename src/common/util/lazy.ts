export type Lazy<T> = {
    /** 値が生成されていなければ生成し、生成済みの値を返す。 */
    get: () => T;
};

/**
 * 遅延評価される値を作成する。
 *
 * @param f - 値を生成する関数。
 * @returns 遅延評価される値。
 */
export function lazy<T>(f: () => T): Lazy<T> {
    let p: T | undefined;
    return {
        get: () => {
            if (p === undefined) {
                p = f();
            }
            return p;
        },
    };
}
