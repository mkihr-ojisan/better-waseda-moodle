import { noopWithCache } from "@/common/util/withCache";
import { Course, CourseProvider } from "../course";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import { isCustomCourse, isMoodleCourse } from "../course-provider-type-guard";

export type CustomCourse = {
    readonly id: string;
    readonly name: string;
    readonly url: string | null;
    readonly hidden: boolean;
    readonly courseKey: string | null;
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
    mergeCourses: (courses: readonly Course[]): readonly Course[] => {
        // カスタム科目と同じ科目がMoodleに追加されたときに自動的に統合する

        const mergedCourses: Course[] = courses.filter(isMoodleCourse);

        // [courseKey, moodleId]
        const moodleCourseKeys = Object.fromEntries(
            courses
                .filter(isMoodleCourse)
                .map((c) => [c.extra.wasedaId?.substring(4, 14), c.id] as const)
                .filter((c): c is [string, string] => c[0] !== undefined)
        );
        // [customId, moodleId]
        const mergedCustomCourseIds: [string, string][] = [];
        for (const customCourse of courses.filter(isCustomCourse)) {
            if (customCourse.extra.courseKey && customCourse.extra.courseKey in moodleCourseKeys) {
                mergedCustomCourseIds.push([customCourse.id, moodleCourseKeys[customCourse.extra.courseKey]]);
                continue;
            }
            mergedCourses.push(customCourse);
        }

        if (mergedCustomCourseIds.length > 0) {
            const nameOverrides = { ...getConfig(ConfigKey.CourseNameOverrides) };
            const syllabusKeys = { ...getConfig(ConfigKey.CourseSyllabusKeys) };
            const deliveryMethods = { ...getConfig(ConfigKey.CourseDeliveryMethods) };
            const streamingURLs = { ...getConfig(ConfigKey.CourseStreamingURLs) };
            const colors = { ...getConfig(ConfigKey.CourseColor) };
            const notes = { ...getConfig(ConfigKey.CourseNotes) };
            const timetableData = { ...getConfig(ConfigKey.TimetableData) };
            let customCourses = [...getConfig(ConfigKey.CustomCourses)];

            for (const [customId, moodleId] of mergedCustomCourseIds) {
                if (customId in nameOverrides) {
                    nameOverrides[moodleId] = nameOverrides[customId];
                    delete nameOverrides[customId];
                }
                if (customId in syllabusKeys) {
                    syllabusKeys[moodleId] = syllabusKeys[customId];
                    delete syllabusKeys[customId];
                }
                if (customId in deliveryMethods) {
                    deliveryMethods[moodleId] = deliveryMethods[customId];
                    delete deliveryMethods[customId];
                }
                if (customId in streamingURLs) {
                    streamingURLs[moodleId] = streamingURLs[customId];
                    delete streamingURLs[customId];
                }
                if (customId in colors) {
                    colors[moodleId] = colors[customId];
                    delete colors[customId];
                }
                if (customId in notes) {
                    notes[moodleId] = notes[customId];
                    delete notes[customId];
                }
                if (customId in timetableData) {
                    timetableData[moodleId] = timetableData[customId];
                    delete timetableData[customId];
                }
            }

            customCourses = customCourses.filter((c) => !mergedCustomCourseIds.some(([customId]) => c.id === customId));

            setConfig(ConfigKey.CourseNameOverrides, nameOverrides);
            setConfig(ConfigKey.CourseSyllabusKeys, syllabusKeys);
            setConfig(ConfigKey.CourseDeliveryMethods, deliveryMethods);
            setConfig(ConfigKey.CourseStreamingURLs, streamingURLs);
            setConfig(ConfigKey.CourseColor, colors);
            setConfig(ConfigKey.CourseNotes, notes);
            setConfig(ConfigKey.TimetableData, timetableData);
            setConfig(ConfigKey.CustomCourses, customCourses);
        }

        return courses;
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
