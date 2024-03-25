import { decode } from "html-entities";
import { Course, CourseProvider } from "../course";
import {
    EnrolledCourse,
    core_course_get_enrolled_courses_by_timeline_classification,
} from "@/common/api/moodle/courses";
import { set_block_myoverview_hidden_course } from "@/common/api/moodle/user_prefs";
import { withCache } from "@/common/util/withCache";

export type MoodleCourse = {
    /** Moodle上でのID */
    readonly id: number;
    /** シラバスとかに使われているっぽいID */
    readonly wasedaId: string | undefined;
    /** 科目名 */
    readonly name: string | undefined;
    /** 開講期間 */
    readonly date: Interval | undefined;
    /** MoodleのコースのURL */
    readonly moodleUrl: string | undefined;
    /** Moodleのコース画像 */
    readonly courseImageUrl: string | undefined;
    /** 開講年度 */
    readonly year: number | undefined;
    /** 非表示かどうか */
    readonly hidden: boolean;
};

export const moodleCourseProvider: CourseProvider = {
    id: "moodle",
    getCourses: withCache<readonly Course[]>("courses", 700, async () => {
        const courses = (await core_course_get_enrolled_courses_by_timeline_classification()).map(
            enrolledCourseToMoodleCourse
        );

        return courses.map((c) => ({
            provider: "moodle",
            id: c.id.toString(),
            name: c.name,
            date: c.date,
            url: c.moodleUrl,
            hidden: c.hidden,
            extra: c,
        }));
    }),

    async setHidden(courseId, hidden) {
        await set_block_myoverview_hidden_course(courseId, hidden);

        // キャッシュを更新する
        const cache = await moodleCourseProvider.getCourses.storage!.get("courses");
        if (cache) {
            await moodleCourseProvider.getCourses.storage!.set(
                "courses",
                cache.value.map((c) => (c.id === courseId.toString() ? { ...c, hidden } : c)),
                cache.timestamp
            );
        }
    },
};

/**
 * EnrolledCourseをMoodleCourseに変換する。
 *
 * @param c - 変換元のEnrolledCourse
 * @returns 変換後のMoodleCourse
 */
function enrolledCourseToMoodleCourse(c: EnrolledCourse): MoodleCourse {
    return {
        id: c.id,
        wasedaId: c.idnumber,
        name: decode(c.fullname),
        date:
            typeof c.startdate === "number" && typeof c.enddate === "number"
                ? {
                      start: c.startdate * 1000,
                      end: c.enddate * 1000,
                  }
                : undefined,
        moodleUrl: c?.viewurl,
        courseImageUrl: c?.courseimage,
        year: parseInt(c?.coursecategory ?? "") || undefined,
        hidden: c.hidden ?? false,
    };
}

/**
 * Moodleから科目のリストを取得する。
 */
export async function fetchMoodleCourses(): Promise<MoodleCourse[]> {
    const courses = (await core_course_get_enrolled_courses_by_timeline_classification()).map(
        enrolledCourseToMoodleCourse
    );

    return courses;
}
