import React, { createContext, ReactElement, useEffect, useMemo, useState } from 'react';
import { Course, CourseListItem } from '../../common/waseda/course/course';
import CenteredCircularProgress from '../../common/react/CenteredCircularProgress';
import useConfig from '../../common/react/useConfig';
import { courseList } from '../content-script';
import NormalView from './normal/NormalView';
import TimetableView from './timetable/TimetableView';
import { CourseDataEntry } from '../../common/waseda/course/course-data';
import { MessengerClient } from '../../common/util/messenger';
import { useCallback } from 'react';
import { DeepReadonly } from '../../common/util/types';
import BWMRoot from '../../common/react/BWMRoot';

export type CourseOverviewType = 'normal' | 'timetable';

export type CourseOverviewContextProps = {
    courseList: CourseListItem[];
    courseData: DeepReadonly<Record<number, CourseDataEntry | undefined>>;
    hideCourse: (course: Course) => void;
    unhideCourse: (course: Course) => void;
};
export const CourseOverviewContext = createContext<CourseOverviewContextProps>({
    courseList: [],
    courseData: {},
    hideCourse: () => {
        /* do nothing */
    },
    unhideCourse: () => {
        /* do nothing */
    },
});

export default React.memo(function CourseOverview(): ReactElement {
    const [courseList, setHiddenFromCourseList] = useCourseList();
    const [courseData] = useConfig('courseData');
    const [courseOverviewType] = useConfig('courseOverview.type');

    const contextValue = useMemo<CourseOverviewContextProps | undefined>(
        () =>
            courseList && {
                courseList,
                courseData,
                hideCourse: (course) => {
                    setHiddenFromCourseList(course, true);
                },
                unhideCourse: (course) => {
                    setHiddenFromCourseList(course, false);
                },
            },
        [courseData, courseList, setHiddenFromCourseList]
    );

    if (contextValue && courseOverviewType) {
        return (
            <BWMRoot>
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
            </BWMRoot>
        );
    } else {
        return (
            <BWMRoot>
                <CenteredCircularProgress />
            </BWMRoot>
        );
    }
});

function useCourseList(): [CourseListItem[] | undefined, (course: Course, isHidden: boolean) => void] {
    const [courseListValue, setCourseListValue] = useState<CourseListItem[] | undefined>(undefined);
    useEffect(() => {
        let isCancelled = false;
        courseList.then((value) => {
            if (!isCancelled) setCourseListValue(value);
        });
        return () => {
            isCancelled = true;
        };
    }, []);

    const setHiddenFromCourseList = useCallback((course: Course, isHidden: boolean) => {
        MessengerClient.exec('setHiddenFromCourseList', course, isHidden);
        setCourseListValue((prev) =>
            prev?.map((c) =>
                c.id === course.id
                    ? {
                          ...c,
                          isHidden,
                      }
                    : c
            )
        );
    }, []);

    return [courseListValue, setHiddenFromCourseList];
}
