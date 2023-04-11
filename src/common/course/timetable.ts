import { useCallback, useMemo } from "react";
import { ConfigKey, ConfigValue, getConfig, setConfig } from "../config/config";
import { useConfig } from "../config/useConfig";
import { DateTimeFormat } from "../util/intl";
import { getSchoolYear } from "../util/school-year";

const longWeekdayFormat = new DateTimeFormat({ weekday: "long" });
const shortWeekdayFormat = new DateTimeFormat({ weekday: "short" });
const yearFormat = new DateTimeFormat({ year: "numeric" });

/** 時間割情報を表す型 */
export type TimetableData = {
    /** 開講年度 */
    year: number;
    /** 学期・クォーター */
    term: Term;
    /** 曜日 */
    day: DayOfWeek;
    period: {
        /** 開始時限 */
        from: number;
        /** 終了時限 */
        toInclusive: number;
    };
    /** 教室 */
    classroom: string;
}[];

/** 曜日を表す文字列 */
export type DayString = NonNullable<ConfigValue<ConfigKey.TimetableData>[number]>[number]["day"];
/** 学期・クォーターを表す文字列 */
export type TermString = NonNullable<ConfigValue<ConfigKey.TimetableData>[number]>[number]["term"];

/** 学期・クォーターを表すクラス */
export class Term {
    /** 春クォーター */
    static SPRING_QUARTER = new Term("spring_quarter");
    /** 夏クォーター */
    static SUMMER_QUARTER = new Term("summer_quarter");
    /** 秋クォーター */
    static FALL_QUARTER = new Term("fall_quarter");
    /** 冬クォーター */
    static WINTER_QUARTER = new Term("winter_quarter");
    /** 春学期 */
    static SPRING_SEMESTER = new Term("spring_semester");
    /** 秋学期 */
    static FALL_SEMESTER = new Term("fall_semester");
    /** 通年 */
    static FULL_YEAR = new Term("full_year");

    private constructor(private readonly value: TermString) {}

    static fromString(value: TermString): Term {
        switch (value) {
            case "spring_quarter":
                return Term.SPRING_QUARTER;
            case "summer_quarter":
                return Term.SUMMER_QUARTER;
            case "fall_quarter":
                return Term.FALL_QUARTER;
            case "winter_quarter":
                return Term.WINTER_QUARTER;
            case "spring_semester":
                return Term.SPRING_SEMESTER;
            case "fall_semester":
                return Term.FALL_SEMESTER;
            case "full_year":
                return Term.FULL_YEAR;
        }
    }

    toString(): TermString {
        return this.value;
    }

    toLocaleString(): string {
        return browser.i18n.getMessage(`term_${this.value}`);
    }

    equals(other: Term): boolean {
        return this.value === other.value;
    }

    /**
     * この学期・クォーターが、指定された学期・クォーターを含むかどうかを返す。
     * 例えば、夏クォーターは春学期に含まれる。
     *
     * @param other - 比較対象の学期・クォーター
     * @returns この学期・クォーターが、指定された学期・クォーターを含む場合は `true`、そうでない場合は `false`
     */
    contains(other: Term): boolean {
        switch (this.value) {
            case "spring_quarter":
                return other.value === "spring_quarter";
            case "summer_quarter":
                return other.value === "summer_quarter";
            case "fall_quarter":
                return other.value === "fall_quarter";
            case "winter_quarter":
                return other.value === "winter_quarter";
            case "spring_semester":
                return (
                    other.value === "spring_semester" ||
                    other.value === "spring_quarter" ||
                    other.value === "summer_quarter"
                );
            case "fall_semester":
                return (
                    other.value === "fall_semester" ||
                    other.value === "fall_quarter" ||
                    other.value === "winter_quarter"
                );
            case "full_year":
                return true;
        }
    }
}

/** 曜日を表すクラス */
export class DayOfWeek {
    /** 月曜日 */
    static MONDAY = new DayOfWeek("monday");
    /** 火曜日 */
    static TUESDAY = new DayOfWeek("tuesday");
    /** 水曜日 */
    static WEDNESDAY = new DayOfWeek("wednesday");
    /** 木曜日 */
    static THURSDAY = new DayOfWeek("thursday");
    /** 金曜日 */
    static FRIDAY = new DayOfWeek("friday");
    /** 土曜日 */
    static SATURDAY = new DayOfWeek("saturday");
    /** 日曜日 */
    static SUNDAY = new DayOfWeek("sunday");

    private constructor(private readonly value: DayString) {}

    static fromString(value: DayString): DayOfWeek {
        switch (value) {
            case "monday":
                return DayOfWeek.MONDAY;
            case "tuesday":
                return DayOfWeek.TUESDAY;
            case "wednesday":
                return DayOfWeek.WEDNESDAY;
            case "thursday":
                return DayOfWeek.THURSDAY;
            case "friday":
                return DayOfWeek.FRIDAY;
            case "saturday":
                return DayOfWeek.SATURDAY;
            case "sunday":
                return DayOfWeek.SUNDAY;
        }
    }

    static fromInteger(value: number): DayOfWeek {
        switch (value) {
            case 0:
                return DayOfWeek.MONDAY;
            case 1:
                return DayOfWeek.TUESDAY;
            case 2:
                return DayOfWeek.WEDNESDAY;
            case 3:
                return DayOfWeek.THURSDAY;
            case 4:
                return DayOfWeek.FRIDAY;
            case 5:
                return DayOfWeek.SATURDAY;
            case 6:
                return DayOfWeek.SUNDAY;
            default:
                throw new Error("Invalid value");
        }
    }

    /**
     * 曜日を表す数値を返す。
     *
     * @returns 月〜日が0〜6になる
     */
    toInteger(): number {
        switch (this.value) {
            case "monday":
                return 0;
            case "tuesday":
                return 1;
            case "wednesday":
                return 2;
            case "thursday":
                return 3;
            case "friday":
                return 4;
            case "saturday":
                return 5;
            case "sunday":
                return 6;
        }
    }

    toString(): DayString {
        return this.value;
    }

    /**
     * ローカライズされた曜日を表す文字列を返す。
     *
     * @returns 「月曜日」「Monday」など
     */
    toLocaleString(): string {
        return longWeekdayFormat.format(new Date(2021, 0, 4 + this.toInteger()));
    }

    /**
     * ローカライズされた曜日を表す文字列を返す。
     *
     * @returns 「月」「Mon」など
     */
    toLocaleStringShort(): string {
        return shortWeekdayFormat.format(new Date(2021, 0, 4 + this.toInteger()));
    }

    equals(other: DayOfWeek): boolean {
        return this.value === other.value;
    }

    static now(): DayOfWeek {
        return DayOfWeek.fromInteger((new Date().getDay() || 7) - 1);
    }
}

/** 年度と学期・クォーターを表すクラス */
export class YearTerm {
    constructor(public readonly year: number, public readonly term: Term) {}

    toLocaleString(): string {
        let str = yearFormat.format(new Date(this.year, 0, 1));
        if (this.term !== Term.FULL_YEAR) {
            str += ` ${this.term.toLocaleString()}`;
        }
        return str;
    }

    equals(other: YearTerm): boolean {
        return this.year === other.year && this.term.equals(other.term);
    }

    contains(other: YearTerm): boolean {
        return this.year === other.year && this.term.contains(other.term);
    }

    /**
     * この年度と学期・クォーターのおおよその期間を返す。
     *
     * @returns この年度と学期・クォーターのおおよその期間
     */
    toApproximateInterval(): { start: Date; end: Date } {
        const start = new Date(this.year, 0, 1);
        const end = new Date(this.year, 0, 31);
        switch (this.term.toString()) {
            case "spring_quarter":
                start.setMonth(3);
                end.setMonth(4);
                break;
            case "summer_quarter":
                start.setMonth(5);
                end.setMonth(6);
                break;
            case "fall_quarter":
                start.setMonth(9);
                end.setMonth(10);
                break;
            case "winter_quarter":
                start.setMonth(11);
                end.setFullYear(this.year + 1);
                end.setMonth(0);
                break;
            case "spring_semester":
                start.setMonth(3);
                end.setMonth(6);
                break;
            case "fall_semester":
                start.setMonth(9);
                end.setFullYear(this.year + 1);
                end.setMonth(0);
                break;
            case "full_year":
                start.setMonth(3);
                end.setFullYear(this.year + 1);
                end.setMonth(2);
                break;
        }
        return { start, end };
    }

    /**
     * 指定した期間を網羅するような`YearTerm`の配列を返す。
     *
     * @param interval - 期間
     * @param precision - 学期単位か、クォーター単位かを指定する。デフォルトはクォーター単位。
     * @returns 指定した期間を網羅するような`YearTerm`の配列
     */
    static fromInterval(interval: Interval, precision: "semester" | "quarter" = "quarter"): YearTerm[] {
        if (interval.start > interval.end) {
            throw new Error("Invalid interval");
        }

        const yearTerms: YearTerm[] = [];

        const start = new Date(interval.start);
        const end = new Date(interval.end);

        const startYear = getSchoolYear(start);
        const endYear = getSchoolYear(end);
        const startMonth = start.getMonth();
        const endMonth = end.getMonth();

        for (let year = startYear; year <= endYear; year++) {
            if (year !== startYear || (3 <= startMonth && startMonth <= 4)) {
                if (year !== endYear || 11 <= endMonth || endMonth <= 2) {
                    yearTerms.push(new YearTerm(year, Term.FULL_YEAR));
                } else if (3 <= endMonth && endMonth <= 4) {
                    if (precision === "quarter") {
                        yearTerms.push(new YearTerm(year, Term.SPRING_QUARTER));
                    } else if (precision === "semester") {
                        yearTerms.push(new YearTerm(year, Term.SPRING_SEMESTER));
                    }
                } else if (5 <= endMonth && endMonth <= 8) {
                    yearTerms.push(new YearTerm(year, Term.SPRING_SEMESTER));
                } else if (9 <= endMonth && endMonth <= 10) {
                    if (precision === "quarter") {
                        yearTerms.push(new YearTerm(year, Term.SPRING_SEMESTER));
                        yearTerms.push(new YearTerm(year, Term.FALL_QUARTER));
                    } else if (precision === "semester") {
                        yearTerms.push(new YearTerm(year, Term.FULL_YEAR));
                    }
                }
            } else if (5 <= startMonth && startMonth <= 6) {
                if (year !== endYear || 11 <= endMonth || endMonth <= 2) {
                    if (precision === "quarter") {
                        yearTerms.push(new YearTerm(year, Term.SUMMER_QUARTER));
                        yearTerms.push(new YearTerm(year, Term.FALL_SEMESTER));
                    } else if (precision === "semester") {
                        yearTerms.push(new YearTerm(year, Term.FULL_YEAR));
                    }
                } else if (5 <= endMonth && endMonth <= 8) {
                    if (precision === "quarter") {
                        yearTerms.push(new YearTerm(year, Term.SUMMER_QUARTER));
                    } else if (precision === "semester") {
                        yearTerms.push(new YearTerm(year, Term.SPRING_SEMESTER));
                    }
                } else if (9 <= endMonth && endMonth <= 10) {
                    if (precision === "quarter") {
                        yearTerms.push(new YearTerm(year, Term.SUMMER_QUARTER));
                        yearTerms.push(new YearTerm(year, Term.FALL_QUARTER));
                    } else if (precision === "semester") {
                        yearTerms.push(new YearTerm(year, Term.FULL_YEAR));
                    }
                }
            } else if (7 <= startMonth && startMonth <= 10) {
                if (year !== endYear || 11 <= endMonth || endMonth <= 2) {
                    yearTerms.push(new YearTerm(year, Term.FALL_SEMESTER));
                } else if (9 <= endMonth && endMonth <= 10) {
                    if (precision === "quarter") {
                        yearTerms.push(new YearTerm(year, Term.FALL_QUARTER));
                    } else if (precision === "semester") {
                        yearTerms.push(new YearTerm(year, Term.FALL_SEMESTER));
                    }
                }
            } else if (11 <= startMonth || startMonth <= 0) {
                if (year !== endYear || 11 <= endMonth || endMonth <= 2) {
                    if (precision === "quarter") {
                        yearTerms.push(new YearTerm(year, Term.WINTER_QUARTER));
                    } else if (precision === "semester") {
                        yearTerms.push(new YearTerm(year, Term.FALL_SEMESTER));
                    }
                }
            }
        }

        return yearTerms;
    }

    /**
     * この年度・学期・クォーターの開始日を比較する。`Array.prototype.sort`の比較関数として使うことができる。
     *
     * @param a - 比較対象の年度と学期・クォーター
     * @param b - 比較対象の年度と学期・クォーター
     * @returns `a`が`b`よりも前に始まる場合は負の数、後に始まる場合は正の数、同じ場合は0
     */
    static compare(a: YearTerm, b: YearTerm): number {
        if (a.year !== b.year) {
            return a.year - b.year;
        } else {
            let at, bt;
            if (a.term === Term.SPRING_QUARTER || a.term === Term.SPRING_SEMESTER) at = 0;
            else if (a.term === Term.SUMMER_QUARTER) at = 1;
            else if (a.term === Term.FALL_QUARTER || a.term === Term.FALL_SEMESTER) at = 2;
            else at = 3;
            if (b.term === Term.SPRING_QUARTER || b.term === Term.SPRING_SEMESTER) bt = 0;
            else if (b.term === Term.SUMMER_QUARTER) bt = 1;
            else if (b.term === Term.FALL_QUARTER || b.term === Term.FALL_SEMESTER) bt = 2;
            else bt = 3;
            return at - bt;
        }
    }
}

/**
 * Configに保存された時間割情報を取得する。
 *
 * @returns 時間割情報
 */
export function getTimetableData(): Partial<Record<string, TimetableData>> {
    const timetableData = getConfig(ConfigKey.TimetableData);

    return Object.fromEntries(
        Object.entries(timetableData).map(([id, data]) => [
            id,
            data &&
                data.map((t) => {
                    return {
                        year: t.year,
                        term: Term.fromString(t.term),
                        day: DayOfWeek.fromString(t.day),
                        period: t.period,
                        classroom: t.classroom,
                    };
                }),
        ])
    );
}

/**
 * 時間割情報をConfigに設定する。
 *
 * @param timetableData - 時間割情報
 */
export function setTimetableData(timetableData: Partial<Record<string, TimetableData>>): void {
    const value = Object.fromEntries(
        Object.entries(timetableData).map(([id, data]) => [
            id,
            data &&
                data.map((t) => {
                    return {
                        year: t.year,
                        term: t.term.toString(),
                        day: t.day.toString(),
                        period: t.period,
                        classroom: t.classroom,
                    };
                }),
        ])
    );
    setConfig(ConfigKey.TimetableData, value);
}

/**
 * 時間割情報を取得するフック。
 *
 * @returns 時間割情報と、時間割情報を更新する関数
 */
export function useTimetableData(): [
    Partial<Record<string, TimetableData>>,
    (timetableData: Partial<Record<string, TimetableData>>) => void
] {
    const [timetableData, setTimetableData] = useConfig(ConfigKey.TimetableData);

    const value = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(timetableData).map(([id, data]) => [
                    id,
                    data &&
                        data.map((t) => {
                            return {
                                year: t.year,
                                term: Term.fromString(t.term),
                                day: DayOfWeek.fromString(t.day),
                                period: t.period,
                                classroom: t.classroom,
                            };
                        }),
                ])
            ),
        [timetableData]
    );

    const setValue = useCallback(
        (data: Partial<Record<string, TimetableData>>) => {
            setTimetableData(
                Object.fromEntries(
                    Object.entries(data).map(([id, data]) => [
                        id,
                        data &&
                            data.map((t) => {
                                return {
                                    year: t.year,
                                    term: t.term.toString(),
                                    day: t.day.toString(),
                                    period: t.period,
                                    classroom: t.classroom,
                                };
                            }),
                    ])
                )
            );
        },
        [setTimetableData]
    );

    return [value, setValue];
}

/**
 * 時間割情報をマージする。重複する場合はbが優先される。
 *
 * @param a - 時間割情報
 * @param b - 時間割情報
 * @returns マージされた時間割情報
 */
export function mergeTimetableData(
    a: Partial<Record<string, TimetableData>>,
    b: Partial<Record<string, TimetableData>>
): Partial<Record<string, TimetableData>> {
    const merged = { ...b };

    for (const [a_id, a_t] of Object.entries(a)) {
        if (!a_t) continue;
        for (const a_tt of a_t) {
            let conflict = false;
            b: for (const b_t of Object.values(b)) {
                if (!b_t) continue;
                for (const b_tt of b_t) {
                    if (
                        a_tt.year === b_tt.year &&
                        (a_tt.term.contains(b_tt.term) || b_tt.term.contains(a_tt.term)) &&
                        a_tt.day === b_tt.day &&
                        a_tt.period.from <= b_tt.period.toInclusive &&
                        b_tt.period.from <= a_tt.period.toInclusive
                    ) {
                        conflict = true;
                        break b;
                    }
                }
            }
            if (!conflict) {
                merged[a_id] = [...(merged[a_id] ?? []), a_tt];
            }
        }
    }

    return merged;
}
