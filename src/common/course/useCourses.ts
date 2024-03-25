import { useCallback, useMemo, useState } from "react";
import { useAsyncGenerator } from "../react/hooks/useAsyncGenerator";
import { call } from "../util/messenger/client";
import { CourseWithSetHidden } from "./course";
import { ConfigKey, getConfig, setConfig } from "../config/config";
import { getCourseColor } from "./course-color";
import { useNotifyError } from "../react/notification";
import { isMoodleCourse } from "./isMoodleCourse";

export type UseCourses = {
    /** 科目のリスト */
    courses: readonly CourseWithSetHidden[] | undefined;
    /** キャッシュを削除し、科目リストを再読み込みする。 */
    reloadCourses: () => void;
};

/**
 * 科目の一覧を取得するフック。
 *
 * @returns 科目の一覧。取得中の場合はundefined。
 */
export function useCourses(): UseCourses {
    const { value: fetchedCourses, reload, error } = useAsyncGenerator(() => call("fetchCourses"), []);

    const [hiddenOverrides, setHiddenOverrides] = useState<Record<string, boolean>>({});

    const courses: readonly CourseWithSetHidden[] | undefined = useMemo(() => {
        const courses = fetchedCourses?.map((c) => ({
            ...c,
            hidden: hiddenOverrides[c.id] ?? c.hidden,
            setHidden: async (hidden: boolean) => {
                setHiddenOverrides((overrides) => ({ ...overrides, [c.id]: hidden }));
                await call("setCourseHidden", c, hidden);
            },
        }));

        // 科目の色が設定されていなければ、デフォルトの色を設定する
        if (courses) {
            (async () => {
                const colors = { ...getConfig(ConfigKey.CourseColor) };
                let isChanged = false;
                for (const course of courses) {
                    if (colors[course.id]) continue;
                    if (!isMoodleCourse(course)) continue;
                    colors[course.id] = await getCourseColor(course.extra);
                    isChanged = true;
                }
                if (isChanged) {
                    setConfig(ConfigKey.CourseColor, colors);
                }
            })();
        }

        return courses;
    }, [fetchedCourses, hiddenOverrides]);

    const reloadCourses = useCallback(() => {
        call("invalidateCourseCache").then(reload);
    }, [reload]);

    useNotifyError(error);

    return { courses, reloadCourses };
}
