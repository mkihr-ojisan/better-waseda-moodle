export type PeriodInfo = readonly (Readonly<
    Record<
        number,
        {
            /** 開始時刻 ([時, 分]) */
            readonly start: readonly [number, number];
            /** 終了時刻 ([時, 分]) */
            readonly end: readonly [number, number];
        }
    >
> & {
    /** このデータが有効な期間の開始日時 */
    readonly since?: number;
    /** このデータが有効な期間の終了日時 */
    readonly until?: number;
})[];

export const PERIODS: PeriodInfo = [
    {
        since: 1680274800000,
        "1": {
            start: [8, 50],
            end: [10, 30],
        },
        "2": {
            start: [10, 40],
            end: [12, 20],
        },
        "3": {
            start: [13, 10],
            end: [14, 50],
        },
        "4": {
            start: [15, 5],
            end: [16, 45],
        },
        "5": {
            start: [17, 0],
            end: [18, 40],
        },
        "6": {
            start: [18, 55],
            end: [20, 35],
        },
        "7": {
            start: [20, 45],
            end: [21, 35],
        },
    },
    {
        until: 1680274800000,
        "1": {
            start: [9, 0],
            end: [10, 30],
        },
        "2": {
            start: [10, 40],
            end: [12, 10],
        },
        "3": {
            start: [13, 0],
            end: [14, 30],
        },
        "4": {
            start: [14, 45],
            end: [16, 15],
        },
        "5": {
            start: [16, 30],
            end: [18, 0],
        },
        "6": {
            start: [18, 15],
            end: [19, 45],
        },
        "7": {
            start: [19, 55],
            end: [21, 25],
        },
    },
];
