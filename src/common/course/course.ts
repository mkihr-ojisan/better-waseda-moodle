import { decode } from "html-entities";
import { core_course_get_enrolled_courses_by_timeline_classification } from "../api/moodle/courses";
import { withCache } from "../util/withCache";
import { set_block_myoverview_hidden_course } from "../api/moodle/user_prefs";

export type Course = {
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

/** 履修している科目のリストを取得する。このAsyncGeneratorはまずキャッシュをyieldし、その後取得したデータをyieldする。 */
export const fetchCourses = withCache<readonly Course[]>("courses", 603, async () => {
    const courses = (await core_course_get_enrolled_courses_by_timeline_classification()).map((c) => ({
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
    }));

    return courses;
});

export type CourseWithSetHidden = Course & {
    /** 科目の非表示状態を変更する。このメソッドはキャッシュも更新する */
    setHidden: (hidden: boolean) => Promise<void>;
};

/**
 * 指定した科目の非表示状態を変更する。
 *
 * @param courseId - 科目のID
 * @param hidden - 非表示にするかどうか
 */
export async function setCourseHidden(courseId: number, hidden: boolean): Promise<void> {
    await set_block_myoverview_hidden_course(courseId, hidden);

    // キャッシュを更新する
    const cache = await fetchCourses.storage.get("courses");
    if (cache) {
        await fetchCourses.storage.set(
            "courses",
            cache.value.map((c) => (c.id === courseId ? { ...c, hidden } : c)),
            cache.timestamp
        );
    }
}
