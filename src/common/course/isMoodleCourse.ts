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
