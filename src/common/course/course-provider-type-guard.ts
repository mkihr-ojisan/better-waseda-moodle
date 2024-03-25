import { Course } from "./course";

/**
 * 指定した科目がMoodleの科目であるかどうか
 *
 * @param course - 科目
 * @returns Moodleの科目である場合true
 */
export function isMoodleCourse(course: Course): course is Course<"moodle"> {
    return course.provider === "moodle";
}

/**
 * 指定した科目がカスタムコースであるかどうか
 *
 * @param course - 科目
 * @returns カスタムコースである場合true
 */
export function isCustomCourse(course: Course): course is Course<"custom"> {
    return course.provider === "custom";
}
