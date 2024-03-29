import { WithCache, concatWithCache } from "../util/withCache";
import { CustomCourse, customCourseProvider } from "./provider/custom";
import { MoodleCourse, moodleCourseProvider } from "./provider/moodle";

export type Course<P extends string = string> = {
    /** この科目を提供しているCourseProviderのid */
    readonly provider: P;
    /** 科目の識別子 */
    readonly id: string;
    /** 科目名 */
    readonly name?: string;
    /** 開講期間 */
    readonly date?: Interval;
    /** この科目に関連付けられたURL */
    readonly url?: string;
    /** 非表示かどうか */
    readonly hidden: boolean;
    /** 追加情報 */
    readonly extra: P extends "moodle" ? MoodleCourse : P extends "custom" ? CustomCourse : unknown;
};

export interface CourseProvider {
    id: string;
    getCourses: WithCache<readonly Course[]>;
    setHidden(courseId: string, hidden: boolean): Promise<void>;
}

const courseProviders = [moodleCourseProvider, customCourseProvider];

/** 科目のリストを取得する。このAsyncGeneratorはまずキャッシュをyieldし、その後取得したデータをyieldする。 */
export const fetchCourses = concatWithCache<Course>(courseProviders.map((p) => p.getCourses));

export type CourseWithSetHidden = Course & {
    /** 科目の非表示状態を変更する。このメソッドはキャッシュも更新する */
    setHidden: (hidden: boolean) => Promise<void>;
};

/**
 * 指定した科目の非表示状態を変更する。
 *
 * @param course - 非表示状態を変更する科目
 * @param course.provider - 非表示状態を変更する科目のCourseProvider
 * @param course.id - 非表示状態を変更する科目の識別子
 * @param hidden - 非表示かどうか
 */
export async function setCourseHidden(course: { provider: string; id: string }, hidden: boolean): Promise<void> {
    const provider = courseProviders.find((p) => p.id === course.provider);
    if (!provider) throw new Error(`Provider not found: ${course.provider}`);
    await provider.setHidden(course.id, hidden);
}
