import {
    Syllabus,
    fetchOldSyllabusSearchYearList,
    fetchSyllabus,
    getCourseDeliveryMethodFromSyllabus,
    getTimetableDataFromSyllabus,
    searchOldSyllabus,
    searchSyllabus,
} from "../api/waseda/syllabus";
import { ConfigKey, ConfigValue, getConfig, setConfig } from "../config/config";
import { assertExtensionContext } from "../util/context";
import { sleep } from "../util/sleep";
import { MoodleCourse, fetchMoodleCourses } from "./provider/moodle";
import { TimetableData, getTimetableData, mergeTimetableData, setTimetableData } from "./timetable";

assertExtensionContext("background");

export type CollectSyllabusInformationOptions = {
    /** 時間割情報が設定されていない科目のみ取得する。デフォルトはfalse */
    onlyCoursesWithoutTimetableInfo?: boolean;
    /** 指定した場合、その年度の科目のみ取得する。指定しない場合はすべての科目を取得する。 */
    year?: number;
    /** 科目の英語名を設定する。デフォルトはfalse */
    setEnglishName?: boolean;
};

export type CollectSyllabusInformationProgress = {
    /** 進捗。0〜1。undefinedの場合はindeterminate */
    progress: number | undefined;
    /** 進捗を表すメッセージ */
    message: string;
};

export type CollectSyllabusInformationResult = {
    /** 取得に成功した科目のリスト */
    succeededCourses: MoodleCourse[];
    /** 取得に失敗した科目のリスト */
    failedCourses: MoodleCourse[];
};

/**
 * シラバスから科目情報を自動取得して設定する。
 *
 * @param options - オプション
 * @yields 進捗状況
 * @returns 取得に成功・失敗した科目のリスト
 */
export async function* collectSyllabusInformation(
    options?: CollectSyllabusInformationOptions
): AsyncGenerator<CollectSyllabusInformationProgress, CollectSyllabusInformationResult, void> {
    yield {
        progress: undefined,
        message: browser.i18n.getMessage("collect_syllabus_information_progress_fetching_courses"),
    };

    let courses = await fetchMoodleCourses();
    if (options?.onlyCoursesWithoutTimetableInfo) {
        const timetableData = getConfig(ConfigKey.TimetableData);
        courses = courses.filter((course) => {
            const data = timetableData[course.id];
            return !data || data.length === 0;
        });
    }
    if (options?.year) {
        courses = courses.filter((course) => course.year === options.year);
    }

    const oldSyllabusSearchYearList = await fetchOldSyllabusSearchYearList();

    const language = !options?.setEnglishName && browser.i18n.getUILanguage() === "ja" ? "jp" : "en";

    const succeededCourses: MoodleCourse[] = [];
    const failedCourses: MoodleCourse[] = [];
    const syllabuses: Record<number, Syllabus> = {};

    courses: for (const [i, course] of courses.entries()) {
        yield {
            progress: i / courses.length,
            message: browser.i18n.getMessage("collect_syllabus_information_progress_searching_syllabus", [
                course.name,
                i + 1,
                courses.length,
            ]),
        };

        const id = course.wasedaId;
        if (!id || id.length !== 16) {
            failedCourses.push(course);
            continue;
        }

        const courseCode = id.substring(4, 14);

        let searchResult;
        if (course.year && oldSyllabusSearchYearList.includes(course.year)) {
            searchResult = searchOldSyllabus({
                courseTitle: course.name,
                year: course.year,
                keywords: courseCode,
                resultLanguage: language,
            });
        } else {
            searchResult = searchSyllabus({
                courseTitle: course.name,
                keywords: courseCode,
                resultLanguage: language,
            });
        }

        for await (const results of searchResult) {
            await sleep(500);

            for (const result of results) {
                if (result.courseTitle !== course.name) {
                    continue;
                }

                yield {
                    progress: i / courses.length,
                    message: browser.i18n.getMessage("collect_syllabus_information_progress_fetching_syllabus", [
                        course.name,
                        i + 1,
                        courses.length,
                    ]),
                };

                await sleep(500);
                try {
                    const syllabus = await fetchSyllabus(result.key, language);
                    syllabuses[course.id] = syllabus;

                    succeededCourses.push(course);

                    continue courses;
                } catch (e) {
                    continue;
                }
            }
        }

        failedCourses.push(course);
    }

    yield {
        progress: undefined,
        message: browser.i18n.getMessage("collect_syllabus_information_progress_setting_course_info"),
    };

    const newTimetableData: Record<string, TimetableData> = {};
    const newCourseSyllabusKeys: Record<string, ConfigValue<ConfigKey.CourseSyllabusKeys>[string]> = {};
    const newCourseDeliveryMethods: Record<string, ConfigValue<ConfigKey.CourseDeliveryMethods>[string]> = {};
    const newNameOverrides: Record<string, string> = {};
    for (const [courseId, syllabus] of Object.entries(syllabuses)) {
        const timetableData = getTimetableDataFromSyllabus(syllabus);
        if (timetableData) {
            newTimetableData[courseId] = timetableData;
        }

        newCourseSyllabusKeys[courseId] = syllabus.key;

        const classDeliveryMethod = getCourseDeliveryMethodFromSyllabus(syllabus);
        if (classDeliveryMethod) {
            newCourseDeliveryMethods[courseId] = classDeliveryMethod;
        }

        if (options?.setEnglishName && syllabus.courseInformation.courseTitle) {
            newNameOverrides[courseId] = syllabus.courseInformation.courseTitle;
        }
    }

    setTimetableData(mergeTimetableData(getTimetableData(), newTimetableData));
    setConfig(ConfigKey.CourseSyllabusKeys, {
        ...getConfig(ConfigKey.CourseSyllabusKeys),
        ...newCourseSyllabusKeys,
    });
    setConfig(ConfigKey.CourseDeliveryMethods, {
        ...getConfig(ConfigKey.CourseDeliveryMethods),
        ...newCourseDeliveryMethods,
    });
    setConfig(ConfigKey.CourseNameOverrides, {
        ...getConfig(ConfigKey.CourseNameOverrides),
        ...newNameOverrides,
    });

    return { succeededCourses, failedCourses };
}
