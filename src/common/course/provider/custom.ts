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

/**
 * カスタム科目を削除する。
 *
 * @param courseId 削除するカスタム科目のID
 */
export async function deleteCustomCourse(courseId: string): Promise<void> {
    const courses = getConfig(ConfigKey.CustomCourses);

    await setConfig(
        ConfigKey.CustomCourses,
        courses.filter((c) => c.id !== courseId)
    );

    const nameOverrides = getConfig(ConfigKey.CourseNameOverrides);
    if (courseId in nameOverrides) {
        const newNameOverrides = { ...nameOverrides };
        delete newNameOverrides[courseId];
        await setConfig(ConfigKey.CourseNameOverrides, newNameOverrides);
    }

    const syllabusKeys = getConfig(ConfigKey.CourseSyllabusKeys);
    if (courseId in syllabusKeys) {
        const newSyllabusKeys = { ...syllabusKeys };
        delete newSyllabusKeys[courseId];
        await setConfig(ConfigKey.CourseSyllabusKeys, newSyllabusKeys);
    }

    const deliveryMethods = getConfig(ConfigKey.CourseDeliveryMethods);
    if (courseId in deliveryMethods) {
        const newDeliveryMethods = { ...deliveryMethods };
        delete newDeliveryMethods[courseId];
        await setConfig(ConfigKey.CourseDeliveryMethods, newDeliveryMethods);
    }

    const streamingURLs = getConfig(ConfigKey.CourseStreamingURLs);
    if (courseId in streamingURLs) {
        const newStreamingURLs = { ...streamingURLs };
        delete newStreamingURLs[courseId];
        await setConfig(ConfigKey.CourseStreamingURLs, newStreamingURLs);
    }

    const colors = getConfig(ConfigKey.CourseColor);
    if (courseId in colors) {
        const newColors = { ...colors };
        delete newColors[courseId];
        await setConfig(ConfigKey.CourseColor, newColors);
    }

    const notes = getConfig(ConfigKey.CourseNotes);
    if (courseId in notes) {
        const newNotes = { ...notes };
        delete newNotes[courseId];
        await setConfig(ConfigKey.CourseNotes, newNotes);
    }

    const timetableData = getConfig(ConfigKey.TimetableData);
    if (courseId in timetableData) {
        const newTimetableData = { ...timetableData };
        delete newTimetableData[courseId];
        await setConfig(ConfigKey.TimetableData, newTimetableData);
    }
}
