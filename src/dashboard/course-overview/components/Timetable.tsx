import { Constants } from "@/common/constants/constants";
import { CourseWithSetHidden } from "@/common/course/course";
import { DayOfWeek, TimetableData, YearTerm } from "@/common/course/timetable";
import { errorToString } from "@/common/error";
import { useNotify } from "@/common/react/notification";
import { Box, useTheme } from "@mui/material";
import { clsx } from "clsx";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { CourseCard } from "./CourseCard";
import { useConstants } from "@/common/constants/useConstants";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";

export type TimetableViewProps = {
    courses: readonly CourseWithSetHidden[];
    timetableData: Partial<Record<string, TimetableData>>;
    selectedYearTerm: YearTerm | null;
};

const days = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
].map((day) => day.toLocaleStringShort());

export const Timetable: FC<TimetableViewProps> = (props) => {
    const [appearanceOptions] = useConfig(ConfigKey.CourseOverviewAppearanceOptions);

    const hasSaturday = useMemo(
        () => props.courses.some((c) => props.timetableData[c.id]?.some((t) => t.day === DayOfWeek.SATURDAY)),
        [props.courses, props.timetableData]
    );
    const hasSunday = useMemo(
        () => props.courses.some((c) => props.timetableData[c.id]?.some((t) => t.day === DayOfWeek.SUNDAY)),
        [props.courses, props.timetableData]
    );
    const has6thPeriod = useMemo(
        () =>
            props.courses.some((c) =>
                props.timetableData[c.id]?.some((t) => t.period.from <= 6 && t.period.toInclusive >= 6)
            ),
        [props.courses, props.timetableData]
    );
    const has7thPeriod = useMemo(
        () =>
            props.courses.some((c) =>
                props.timetableData[c.id]?.some((t) => t.period.from <= 7 && t.period.toInclusive >= 7)
            ),
        [props.courses, props.timetableData]
    );

    // 基本は月〜金と1〜5限で、そこに収まっていない場合は広げる
    const rows = has7thPeriod ? 7 : has6thPeriod ? 6 : 5;
    const columns = hasSunday ? 7 : hasSaturday ? 6 : 5;

    const cells = useMemo(() => {
        const cells: ({ course: CourseWithSetHidden; rowSpan: number; classroom: string } | null | undefined)[][] = [
            ...Array(rows),
        ].map(() => Array(columns).fill(null));

        if (!props.selectedYearTerm) return cells;

        for (const course of props.courses) {
            const timetableData = props.timetableData[course.id];
            if (!timetableData) continue;

            for (const timetable of timetableData) {
                if (!new YearTerm(timetable.year, timetable.term).contains(props.selectedYearTerm)) continue;

                cells[timetable.period.from - 1][timetable.day.toInteger()] = {
                    course,
                    rowSpan: timetable.period.toInclusive - timetable.period.from + 1,
                    classroom: timetable.classroom,
                };
                for (let period = timetable.period.from + 1; period <= timetable.period.toInclusive; period++) {
                    cells[period - 1][timetable.day.toInteger()] = undefined;
                }
            }
        }

        return cells;
    }, [columns, props.courses, props.selectedYearTerm, props.timetableData, rows]);

    const { value: constant, error: constantError } = useConstants();
    const notify = useNotify();

    useEffect(() => {
        if (constantError) {
            notify({
                type: "error",
                message: errorToString(constantError),
            });
        }
    }, [constantError, notify]);

    const periodData = useMemo(() => {
        if (!props.selectedYearTerm) return undefined;
        const term = props.selectedYearTerm.toApproximateInterval();

        return constant?.period?.find(
            (p) => (!p.since || p.since <= term.start.getTime()) && (!p.until || p.until > term.end.getTime())
        );
    }, [constant?.period, props.selectedYearTerm]);

    const currentDayOfWeek = useCurrentDayOfWeek();
    const currentPeriod = useCurrentPeriod(periodData);

    const theme = useTheme();

    return (
        <Box
            pb={2}
            sx={{
                "td, th": {
                    border: "1px solid",
                    textAlign: "center",
                },
                table: {
                    tableLayout: "fixed",
                    width: "100%",
                },
                "th:first-of-type": {
                    width: appearanceOptions.showPeriodTime ? "3em" : "2em",
                },
                "thead tr": {
                    height: "2em",
                },
                "tbody th": {
                    // ここでheightを設定しないと、.periodのheightが効かない
                    height: `max(7em, calc((clamp(30em, calc(100vh - 30em), 100em) - 2em) / ${rows}))`,
                },
                ".active": {
                    borderBottom: `3px solid ${theme.palette.primary.main}`,
                    padding: "0 0.5em",
                },
                ".period": {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "100%",
                },
                ".start-time, .end-time": {
                    fontSize: "0.8em",
                    fontWeight: "normal",
                },
            }}
        >
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {days.slice(0, columns).map((day, i) => (
                            <th key={day}>
                                <span
                                    className={clsx(
                                        i === currentDayOfWeek.toInteger() &&
                                            appearanceOptions.emphasizeCurrentDayAndPeriod &&
                                            "active"
                                    )}
                                >
                                    {day}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cells.map((row, i) => (
                        <tr key={i}>
                            <th>
                                <div className="period">
                                    <div className="start-time">
                                        {appearanceOptions.showPeriodTime &&
                                            periodData &&
                                            timeToString(periodData[i + 1].start)}
                                    </div>
                                    <div
                                        className={clsx(
                                            "period-number",
                                            i + 1 === currentPeriod &&
                                                appearanceOptions.emphasizeCurrentDayAndPeriod &&
                                                "active"
                                        )}
                                    >
                                        {i + 1}
                                    </div>
                                    <div className="end-time">
                                        {appearanceOptions.showPeriodTime &&
                                            periodData &&
                                            timeToString(periodData[i + 1].end)}
                                    </div>
                                </div>
                            </th>
                            {row
                                .filter((v) => v !== undefined)
                                .map((cell, j) => (
                                    <Box
                                        component="td"
                                        p={0.5}
                                        key={j}
                                        rowSpan={cell?.rowSpan}
                                        sx={{
                                            height:
                                                cell &&
                                                `calc(max(7em, calc((clamp(30em, calc(100vh - 30em), 100em) - 2em) / ${rows})) * ${cell?.rowSpan})`,
                                        }}
                                    >
                                        {cell?.course && (
                                            <CourseCard
                                                course={cell?.course}
                                                height="fill-parent"
                                                classroom={cell?.classroom}
                                                inTimetable
                                            />
                                        )}
                                    </Box>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
};

/**
 * [時, 分]を文字列に変換する
 *
 * @param time - [時, 分]
 * @returns 時:分
 */
function timeToString(time: readonly [number, number]) {
    return `${time[0].toString()}:${time[1].toString().padStart(2, "0")}`;
}

/**
 * 現在の時刻に対応する時限を返す
 *
 * @param periodData - Constants
 * @returns 現在の時限
 */
function useCurrentPeriod(periodData: NonNullable<Constants["period"]>[number] | undefined): number | null {
    const [currentPeriod, setCurrentPeriod] = useState<number | null>(null);

    /**
     * 時限を更新する。
     *
     * @returns 次に更新するまでの時間（ミリ秒）
     */
    const updateCurrentPeriod = useCallback((): number | null => {
        if (!periodData) {
            setCurrentPeriod(null);
            return null;
        }

        const now = new Date();

        /**
         * [時, 分]を今日のDateに変換する
         *
         * @param time - [時, 分]
         * @returns Date
         */
        function timeToDate(time: readonly [number, number]) {
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), time[0], time[1]);
        }

        if (timeToDate(periodData[1].start) > now) {
            setCurrentPeriod(null);
            return timeToDate(periodData[1].start).getTime() - now.getTime();
        }
        for (let i = 1; i <= 6; i++) {
            if (timeToDate(periodData[i + 1].start) > now) {
                setCurrentPeriod(i);
                return timeToDate(periodData[i + 1].start).getTime() - now.getTime();
            }
        }
        if (timeToDate(periodData[7].end) > now) {
            setCurrentPeriod(7);
            return timeToDate(periodData[7].end).getTime() - now.getTime();
        }
        setCurrentPeriod(null);
        return timeToDate(periodData[1].start).getTime() - now.getTime() + 24 * 60 * 60 * 1000;
    }, [periodData]);

    useEffect(() => {
        let timeout: number | null = null;

        const update = () => {
            timeout = updateCurrentPeriod();
            if (timeout !== null) {
                setTimeout(update, timeout);
            }
        };
        update();

        return () => {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
        };
    }, [periodData, updateCurrentPeriod]);

    return currentPeriod;
}

/**
 * 現在の曜日を返す
 *
 * @returns 現在の曜日
 */
function useCurrentDayOfWeek(): DayOfWeek {
    const [currentDayOfWeek, setCurrentDayOfWeek] = useState<DayOfWeek>(DayOfWeek.now());

    useEffect(() => {
        const update = () => {
            setCurrentDayOfWeek(DayOfWeek.now());

            const now = new Date();
            setTimeout(
                update,
                new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
            );
        };
        update();
    }, []);

    return currentDayOfWeek;
}
