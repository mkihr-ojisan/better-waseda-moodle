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
