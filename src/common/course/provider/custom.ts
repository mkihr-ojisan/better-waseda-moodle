import { noopWithCache } from "@/common/util/withCache";
import { Course, CourseProvider } from "../course";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";

export type CustomCourse = {
    readonly id: string;
    readonly name: string;
    readonly url: string | null;
    readonly hidden: boolean;
};

export const customCourseProvider: CourseProvider = {
    id: "custom",
    getCourses: noopWithCache<readonly Course<"custom">[]>(() => {
        const courses = getConfig(ConfigKey.CustomCourses);
        return Promise.resolve(
            courses.map((course) => ({
                provider: "custom",
                id: course.id,
                name: course.name,
                url: course.url ?? undefined,
                hidden: course.hidden,
                extra: course,
            }))
        );
    }),
    async setHidden(courseId, hidden) {
        const courses = getConfig(ConfigKey.CustomCourses);
        const course = courses.find((c) => c.id === courseId);
        if (!course) throw new Error(`Course not found: ${courseId}`);
        course.hidden = hidden;
        await setConfig(ConfigKey.CustomCourses, courses);
    },
};

/**
 * カスタム科目を追加する。
 *
 * @param course 追加するカスタム科目
 * @returns 追加したカスタム科目のID
 */
export async function addCustomCourse(course: Omit<CustomCourse, "id">): Promise<string> {
    const courses = getConfig(ConfigKey.CustomCourses);

    const id = "custom-" + (Math.max(0, ...courses.map((c) => parseInt(c.id.replace(/^custom-/, ""), 10))) + 1);

    await setConfig(ConfigKey.CustomCourses, [...courses, { id, ...course }]);

    return id;
}
