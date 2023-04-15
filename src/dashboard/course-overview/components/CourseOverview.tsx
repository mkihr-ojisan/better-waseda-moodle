import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import { Term, TimetableData, useTimetableData, YearTerm } from "@/common/course/timetable";
import { useCourses } from "@/common/course/useCourses";
import { AppBar, Box, CircularProgress, Grid, Toolbar, Typography } from "@mui/material";
import { areIntervalsOverlapping } from "date-fns";
import React, { ContextType, createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CourseCard } from "./CourseCard";
import { CourseOverviewMenu } from "./CourseOverviewMenu";
import { Timetable } from "./Timetable";
import { YearTermSelector } from "./YearTermSelector";
import { useConfig } from "@/common/config/useConfig";
import { NoTimetableDataTip } from "./NoTimetableDataTip";

export const CourseOverviewContext = createContext<
    | {
          showHiddenCourses: boolean;
          setShowHiddenCourses: (showHiddenCourses: boolean) => void;
          reloadCourses: () => void;
          selectedYearTerm: YearTerm | null;
          timetableData: Partial<Record<string, TimetableData>>;
      }
    | undefined
>(undefined);

/**
 * CourseOverviewContextを使用する。ContextOverview外で使用するとエラー。
 *
 * @returns CourseOverviewContextの値
 */
export function useCourseOverviewContext(): NonNullable<ContextType<typeof CourseOverviewContext>> {
    const context = useContext(CourseOverviewContext);
    if (context === undefined) {
        throw new Error("useCourseOverviewContext must be used within a CourseOverviewContext.Provider");
    }
    return context;
}

export const CourseOverview: FC = () => {
    const [selectedYearTerm, setSelectedYearTerm] = useState<YearTerm | null>(null);
    const [showHiddenCourses, setShowHiddenCourses] = useState(false);

    const { courses, reloadCourses } = useCourses();
    const visibleCourses = useMemo(
        () => (showHiddenCourses ? courses : courses?.filter((c) => !c.hidden)),
        [courses, showHiddenCourses]
    );

    useEffect(() => {
        setSelectedYearTerm(getSavedSelectedYearTerm());
    }, [courses]);

    const [timetableData] = useTimetableData();

    const coursesInTimetable = useMemo(
        () =>
            visibleCourses?.filter((course) =>
                timetableData[course.id]?.some(
                    (d) => selectedYearTerm && new YearTerm(d.year, d.term).contains(selectedYearTerm)
                )
            ) ?? [],
        [visibleCourses, selectedYearTerm, timetableData]
    );

    const coursesNotInTimetable = useMemo(() => {
        let coursesNotInTimetable;
        if (selectedYearTerm) {
            // 年度・学期が選択されている場合は、Moodle上でコースに設定されている期間から年度・学期を計算し、それが一致する科目を表示する
            const selectedYearTermInterval = selectedYearTerm.toApproximateInterval();
            coursesNotInTimetable = visibleCourses?.filter((course) => {
                if (!course.date || (timetableData[course.id]?.length ?? 0) > 0) return false;
                const courseInterval = course.date;
                return areIntervalsOverlapping(selectedYearTermInterval, courseInterval);
            });
        } else {
            // そうでない場合はすべて表示する
            coursesNotInTimetable = visibleCourses && [...visibleCourses];
        }
        return coursesNotInTimetable?.sort((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0);
    }, [selectedYearTerm, timetableData, visibleCourses]);

    const handleChangeSelectedYearTerm = useCallback((value: YearTerm | null) => {
        saveSelectedYearTerm(value);
        setSelectedYearTerm(value);
    }, []);

    const [hiddenTips, setHiddenTips] = useConfig(ConfigKey.HiddenTips);
    const handleHideNoTimetableDataTip = useCallback(() => {
        setHiddenTips([...hiddenTips, "no_timetable_data"]);
    }, [hiddenTips, setHiddenTips]);

    const context = useMemo(
        () => ({
            showHiddenCourses,
            setShowHiddenCourses,
            selectedYearTerm,
            timetableData,
            reloadCourses,
        }),
        [reloadCourses, selectedYearTerm, showHiddenCourses, timetableData]
    );

    return (
        <>
            {visibleCourses ? (
                <CourseOverviewContext.Provider value={context}>
                    <Box mb={1}>
                        <AppBar variant="outlined" position="static" color="transparent" elevation={0}>
                            <Toolbar variant="dense" disableGutters>
                                <YearTermSelector
                                    selectedYearTerm={selectedYearTerm}
                                    onChange={handleChangeSelectedYearTerm}
                                    courses={visibleCourses}
                                    timetableData={timetableData}
                                />
                                <Box sx={{ flexGrow: 1 }} />
                                <CourseOverviewMenu />
                            </Toolbar>
                        </AppBar>
                    </Box>

                    {coursesInTimetable.length > 0 && (
                        <Timetable
                            courses={coursesInTimetable}
                            timetableData={timetableData}
                            selectedYearTerm={selectedYearTerm}
                        />
                    )}

                    {coursesInTimetable.length === 0 &&
                        selectedYearTerm !== null &&
                        !hiddenTips.includes("no_timetable_data") && (
                            <NoTimetableDataTip onHide={handleHideNoTimetableDataTip} />
                        )}

                    <Grid container spacing={1}>
                        {coursesNotInTimetable?.map((course) => (
                            <Grid item key={course.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                                <CourseCard course={course} height="fixed" />
                            </Grid>
                        ))}
                    </Grid>
                </CourseOverviewContext.Provider>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        {browser.i18n.getMessage("course_overview_loading_message")}
                    </Typography>
                </Box>
            )}
        </>
    );
};

/**
 * 最後に選択した年度・学期を取得する
 *
 * @returns 最後に選択した年度・学期。「すべて」を選択している場合はnull
 */
function getSavedSelectedYearTerm(): YearTerm | null {
    const yearTerm = getConfig(ConfigKey.CourseOverviewSelectedYearTerm);
    if (yearTerm) {
        return new YearTerm(yearTerm.year, Term.fromString(yearTerm.term));
    } else {
        return null;
    }
}

/**
 * 選択した年度・学期を保存する
 *
 * @param yearTerm - 選択した年度・学期。「すべて」を選択している場合はnull
 */
function saveSelectedYearTerm(yearTerm: YearTerm | null) {
    if (yearTerm) {
        const { year, term } = yearTerm;
        setConfig(ConfigKey.CourseOverviewSelectedYearTerm, { year, term: term.toString() });
    } else {
        setConfig(ConfigKey.CourseOverviewSelectedYearTerm, null);
    }
}
