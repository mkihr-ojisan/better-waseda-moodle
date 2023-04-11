import { Course } from "@/common/course/course";
import { Term, TimetableData, YearTerm } from "@/common/course/timetable";
import { minByKey } from "@/common/util/array";
import { getSchoolYear } from "@/common/util/school-year";
import { Tab, Tabs } from "@mui/material";
import React, { FC, useCallback, useMemo } from "react";

export type YearTermSelectorProps = {
    selectedYearTerm: YearTerm | null;
    onChange: (yearTerm: YearTerm | null) => void;
    courses: readonly Course[];
    timetableData: Partial<Record<string, TimetableData>>;
};

export const YearTermSelector: FC<YearTermSelectorProps> = (props) => {
    const items = useMemo(
        () =>
            makeYearTermList(props.courses, props.timetableData).map((yt) => ({
                value: yt,
                label: yt.toLocaleString(),
            })),
        [props.courses, props.timetableData]
    );

    const selectedItem = useMemo(() => {
        const selectedYearTerm = props.selectedYearTerm;
        if (selectedYearTerm === null) {
            return -1;
        } else {
            const index = items.findIndex((item) => item.value.equals(selectedYearTerm));
            if (index === -1) {
                // 選択された年度・学期が選択肢にない場合は、適当に近いものを選ぶ
                const index = minByKey(items, (item) => Math.abs(YearTerm.compare(selectedYearTerm, item.value)));

                setTimeout(() => props.onChange(index === -1 ? null : items[index].value), 0); // レンダー中に他コンポーネントの状態を変更すると怒られるので遅延させる
            }
            return index;
        }
    }, [items, props]);

    const handleChange = useCallback(
        (_event: any, value: any) => {
            const index = value as number;
            props.onChange(index === -1 ? null : items[index].value);
        },
        [items, props]
    );

    return (
        <Tabs value={selectedItem} onChange={handleChange} variant="scrollable">
            <Tab value={-1} label={browser.i18n.getMessage("course_overview_show_all")} />
            {items.map((item, index) => (
                <Tab key={index} value={index} label={item.label} />
            ))}
        </Tabs>
    );
};

/**
 * 年度・学期の選択肢を作成する
 *
 * @param courses - 科目のリスト
 * @param timetableData - 全科目の時間割情報
 * @returns 年度・学期の選択肢
 */
function makeYearTermList(
    courses: readonly Course[],
    timetableData: Partial<Record<string, TimetableData>>
): YearTerm[] {
    const termFlags: Record<
        number,
        {
            spring_quarter?: boolean;
            summer_quarter?: boolean;
            fall_quarter?: boolean;
            winter_quarter?: boolean;
            spring_semester?: boolean;
            fall_semester?: boolean;
            full_year?: boolean;
        }
    > = {};

    for (const course of courses) {
        const timetable = timetableData[course.id];

        let yearTerms;
        if (timetable && timetable.length > 0) {
            yearTerms = timetable;
        } else if (course.date) {
            // 時間割情報が設定されていない科目については、Moodle上でコースに設定された期間から選択肢を作成する
            const currentYear = getSchoolYear(new Date());
            yearTerms = YearTerm.fromInterval(course.date, "semester").filter(({ year }) => year <= currentYear); // 未来の分は表示しない
        } else {
            continue;
        }
        for (const { year, term } of yearTerms) {
            termFlags[year] ??= {};
            switch (term.toString()) {
                case "spring_quarter":
                    termFlags[year].spring_quarter = true;
                    break;
                case "summer_quarter":
                    termFlags[year].summer_quarter = true;
                    break;
                case "fall_quarter":
                    termFlags[year].fall_quarter = true;
                    break;
                case "winter_quarter":
                    termFlags[year].winter_quarter = true;
                    break;
                case "spring_semester":
                    termFlags[year].spring_semester = true;
                    break;
                case "fall_semester":
                    termFlags[year].fall_semester = true;
                    break;
                case "full_year":
                    termFlags[year].full_year = true;
                    break;
            }
        }
    }

    const yearTerms: YearTerm[] = [];
    for (const [year, flags] of Object.entries(termFlags)) {
        const terms: Term[] = [];
        if (flags.spring_quarter) {
            terms.push(Term.SPRING_QUARTER);
        }
        if (flags.summer_quarter) {
            terms.push(Term.SUMMER_QUARTER);
        }
        if (flags.fall_quarter) {
            terms.push(Term.FALL_QUARTER);
        }
        if (flags.winter_quarter) {
            terms.push(Term.WINTER_QUARTER);
        }
        if (flags.spring_semester) {
            if (flags.spring_quarter && !terms.includes(Term.SUMMER_QUARTER)) {
                terms.push(Term.SUMMER_QUARTER);
            }
            if (flags.summer_quarter && !terms.includes(Term.FALL_QUARTER)) {
                terms.push(Term.FALL_QUARTER);
            }
            if (!flags.spring_quarter && !flags.summer_quarter) {
                terms.push(Term.SPRING_SEMESTER);
            }
        }
        if (flags.fall_semester) {
            if (flags.fall_quarter && !terms.includes(Term.WINTER_QUARTER)) {
                terms.push(Term.WINTER_QUARTER);
            }
            if (flags.winter_quarter && !terms.includes(Term.SPRING_QUARTER)) {
                terms.push(Term.SPRING_QUARTER);
            }
            if (!flags.fall_quarter && !flags.winter_quarter) {
                terms.push(Term.FALL_SEMESTER);
            }
        }
        if (flags.full_year) {
            if (flags.spring_semester && !terms.includes(Term.FALL_SEMESTER)) {
                if (flags.fall_quarter && !terms.includes(Term.WINTER_QUARTER)) {
                    terms.push(Term.WINTER_QUARTER);
                }
                if (flags.winter_quarter && !terms.includes(Term.SPRING_QUARTER)) {
                    terms.push(Term.SPRING_QUARTER);
                }
                if (!flags.fall_quarter && !flags.winter_quarter) {
                    terms.push(Term.FALL_SEMESTER);
                }
            }
            if (flags.fall_semester && !terms.includes(Term.SPRING_SEMESTER)) {
                if (flags.spring_quarter && !terms.includes(Term.SUMMER_QUARTER)) {
                    terms.push(Term.SUMMER_QUARTER);
                }
                if (flags.summer_quarter && !terms.includes(Term.FALL_QUARTER)) {
                    terms.push(Term.FALL_QUARTER);
                }
                if (!flags.spring_quarter && !flags.summer_quarter) {
                    terms.push(Term.SPRING_SEMESTER);
                }
            }
            if (
                !flags.spring_semester &&
                !flags.fall_semester &&
                !flags.spring_quarter &&
                !flags.summer_quarter &&
                !flags.fall_quarter &&
                !flags.winter_quarter
            ) {
                terms.push(Term.FULL_YEAR);
            }
        }
        yearTerms.push(...terms.map((term) => new YearTerm(parseInt(year), term)));
    }

    return yearTerms.sort(YearTerm.compare);
}
