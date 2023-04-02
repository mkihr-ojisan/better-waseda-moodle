import {
    Syllabus,
    SyllabusClassModalityCategory,
    fetchOldSyllabusSearchYearList,
    fetchSyllabus,
    searchOldSyllabus,
    searchSyllabus,
} from "../api/waseda/syllabus";
import { ConfigKey, ConfigValue, getConfig, setConfig } from "../config/config";
import { assertExtensionContext } from "../util/context";
import { sleep } from "../util/sleep";
import { zenkaku2hankaku } from "../util/zenkaku";
import { Course, fetchCourses } from "./course";
import { TimetableData, getTimetableData, mergeTimetableData, setTimetableData } from "./timetable";

assertExtensionContext("background");

export type CollectSyllabusInformationOptions = {
    /** 時間割情報が設定されていない科目のみ取得する。デフォルトはfalse */
    onlyCoursesWithoutTimetableInfo?: boolean;
    /** 指定した場合、その年度の科目のみ取得する。指定しない場合はすべての科目を取得する。 */
    year?: number;
};

export type CollectSyllabusInformationProgress = {
    /** 進捗。0〜1。undefinedの場合はindeterminate */
    progress: number | undefined;
    /** 進捗を表すメッセージ */
    message: string;
};

export type CollectSyllabusInformationResult = {
    /** 取得に成功した科目のリスト */
    succeededCourses: Course[];
    /** 取得に失敗した科目のリスト */
    failedCourses: Course[];
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

    await fetchCourses.invalidateCache();
    let courses = await fetchCourses.promise();
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

    const language = browser.i18n.getUILanguage() === "ja" ? "jp" : "en";

    const succeededCourses: Course[] = [];
    const failedCourses: Course[] = [];
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
    for (const [courseId, syllabus] of Object.entries(syllabuses)) {
        if (
            syllabus.courseInformation.dayPeriods &&
            syllabus.courseInformation.dayPeriods.length > 0 &&
            syllabus.courseInformation.year &&
            syllabus.courseInformation.term
        ) {
            const year = syllabus.courseInformation.year;
            const term = syllabus.courseInformation.term;

            newTimetableData[courseId] = syllabus.courseInformation.dayPeriods.map((dayPeriod, i) => ({
                year,
                term,
                day: dayPeriod.day,
                period: dayPeriod.period,
                classroom: zenkaku2hankaku(syllabus.courseInformation.classroom?.[i] ?? "")
                    .replace(/教室$/, "")
                    .replace(/室$/, ""),
            }));
        }
        newCourseSyllabusKeys[courseId] = syllabus.key;

        switch (syllabus.courseInformation.classModalityCategories) {
            case SyllabusClassModalityCategory.OnCampus:
            case SyllabusClassModalityCategory.OnCampusHybridOver50Percent:
            case SyllabusClassModalityCategory.OnlineHybridUnder50Percent:
            case SyllabusClassModalityCategory.EmergencyHybrid:
            case SyllabusClassModalityCategory.Hybrid:
                newCourseDeliveryMethods[courseId] = "face_to_face";
                break;
            case SyllabusClassModalityCategory.OnlineFullOnDemand:
            case SyllabusClassModalityCategory.EmergencyFullOnDemand:
            case SyllabusClassModalityCategory.FullOnDemand:
            case SyllabusClassModalityCategory.OnDemand:
                newCourseDeliveryMethods[courseId] = "on_demand";
                break;
            case SyllabusClassModalityCategory.OnlineRealtimeStreaming:
            case SyllabusClassModalityCategory.EmergencyRealtimeStreaming:
            case SyllabusClassModalityCategory.RealtimeStreaming:
                newCourseDeliveryMethods[courseId] = "realtime_streaming";
                break;
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

    return { succeededCourses, failedCourses };
}
