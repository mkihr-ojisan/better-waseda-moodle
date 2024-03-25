/**
 * 指定した日付から年度を取得する
 *
 * @param date - 日付
 * @returns 年度
 */
export function getSchoolYear(date: number | Date): number {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 3);
    return d.getFullYear();
}

/**
 * 指定した年度の期間を取得する
 *
 * @param year - 年度
 * @returns 期間
 */
export function schoolYearToInterval(year: number): Interval {
    return {
        start: new Date(year, 3, 1).getTime(),
        end: new Date(year + 1, 2, 31).getTime(),
    };
}
