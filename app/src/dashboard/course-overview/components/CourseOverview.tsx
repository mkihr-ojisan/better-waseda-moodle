import React, { createContext, ReactElement, useEffect, useMemo, useState } from 'react';
import { onConfigChange, removeConfigChangeListener } from '../../../common/config/config';
import { Course, CourseListItem } from '../../../common/course';
import BWMThemeDarkReader from '../../../common/react/theme/BWMThemeDarkReader';
import CenteredCircularProgress from '../../../common/react/CenteredCircularProgress';
import useConfig from '../../../common/react/useConfig';
import { TimetableEntry } from '../../../common/timetable';
import { courseList, messengerClient, timetableEntries } from '../content-script';
import NormalView from './normal/NormalView';
import TimetableView from './timetable/TimetableView';

export type CourseOverviewType = 'normal' | 'timetable';

export type CourseOverviewContextProps = {
    courseList: CourseListItem[];
    timetableEntries: TimetableEntry[];
    hideCourse: (course: Course) => void;
    unhideCourse: (course: Course) => void;
};
export const CourseOverviewContext = createContext<CourseOverviewContextProps>({
    courseList: [],
    timetableEntries: [],
    hideCourse: () => { /* do nothing */ },
    unhideCourse: () => { /* do nothing */ },
});

export default function CourseOverview(): ReactElement {
    const [courseList, setHiddenFromCourseList] = useCourseList();
    const timetableEntries = useTimetableEntries();
    const [courseOverviewType] = useConfig('courseOverview.type');

    const contextValue = useMemo<CourseOverviewContextProps | undefined>(() => courseList && timetableEntries && ({
        courseList,
        timetableEntries,
        hideCourse: course => {
            setHiddenFromCourseList(course, true);
        },
        unhideCourse: course => {
            setHiddenFromCourseList(course, false);
        },
    }), [courseList, setHiddenFromCourseList, timetableEntries]);

    if (contextValue && courseOverviewType) {
        return (
            <BWMThemeDarkReader>
                <CourseOverviewContext.Provider value={contextValue}>
                    {(() => {
                        switch (courseOverviewType) {
                            case 'normal':
                                return <NormalView />;
                            case 'timetable':
                                return <TimetableView />;
                        }
                    })()}
                </CourseOverviewContext.Provider>
            </BWMThemeDarkReader>
        );
    } else {
        return (
            <BWMThemeDarkReader>
                <CenteredCircularProgress />
            </BWMThemeDarkReader>
        );
    }
}

function useCourseList(): [CourseListItem[] | undefined, (course: Course, isHidden: boolean) => void] {
    const [courseListValue, setCourseListValue] = useState<CourseListItem[] | undefined>(undefined);
    useEffect(() => {
        let isCancelled = false;
        courseList.then(value => {
            if (!isCancelled) setCourseListValue(value);
        });
        return () => {
            isCancelled = true;
        };
    }, []);

    const setHiddenFromCourseList = (course: Course, isHidden: boolean) => {
        messengerClient.exec('setHiddenFromCourseList', course, isHidden);
        setCourseListValue(
            courseListValue?.map(c =>
                c.id === course.id ?
                    {
                        ...c,
                        isHidden,
                    } :
                    c,
            ),
        );
    };

    return [courseListValue, setHiddenFromCourseList];
}

function useTimetableEntries(): TimetableEntry[] | undefined {
    const [timetableEntriesValue, setTimetableEntriesValue] = useState<TimetableEntry[] | undefined>(undefined);
    useEffect(() => {
        let isCancelled = false;

        timetableEntries.then(value => {
            if (!isCancelled) setTimetableEntriesValue(value);
        });

        const listener = (_: TimetableEntry[] | undefined, value: TimetableEntry[]) => {
            setTimetableEntriesValue(value);
        };
        onConfigChange('timetable.entries', listener, false);

        return () => {
            isCancelled = true;
            removeConfigChangeListener('timetable.entries', listener);
        };
    }, []);

    return timetableEntriesValue;
}