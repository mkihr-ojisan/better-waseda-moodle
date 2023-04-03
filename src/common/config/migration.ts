import equal from "fast-deep-equal";
import { assertExtensionContext } from "../util/context";
import { compressObject, decompressObject } from "../util/object-compression";
import { compareVersion } from "../util/version";
import { ConfigKey, CONFIG_VALUE_TYPE_DEF, CONFIG_DEFAULT_VALUES } from "./config";

assertExtensionContext("background");

/** 旧バージョンのconfigを移行する。 */
export async function migrateConfig(): Promise<void> {
    const configVersion =
        (await browser.storage.sync.get(ConfigKey.LastVersion.toString()))[ConfigKey.LastVersion.toString()] ?? "0";
    const version = browser.runtime.getManifest().version;

    if (compareVersion(configVersion, version) > 0) {
        throw Error(`Config version is newer than extension version: ${configVersion} > ${version}`);
    } else if (configVersion === version) {
        return;
    }

    let newConfig: Record<string, unknown> = {
        [ConfigKey.LastVersion.toString()]: browser.runtime.getManifest().version,
    };

    if (compareVersion(configVersion, "0.6.0") < 0) {
        const oldConfig = {
            ...(await browser.storage.local.get()),
            ...(await browser.storage.sync.get()),
        };

        type CourseDataEntry = {
            overrideName?: string;
            timetableData?: {
                yearTerm: {
                    year: number;
                    term:
                        | "spring_quarter"
                        | "summer_quarter"
                        | "fall_quarter"
                        | "winter_quarter"
                        | "spring_semester"
                        | "fall_semester"
                        | "full_year";
                };
                dayPeriod: {
                    day: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
                    period: {
                        from: number;
                        to: number;
                    };
                };
            }[];
            syllabusUrl?: string;
            note?: string;
        };

        newConfig = {
            ...newConfig,
            [ConfigKey.AutoLoginEnabled]: oldConfig["autoLogin.enabled"],
            [ConfigKey.LoginInfo]: {
                userId: oldConfig["autoLogin.loginId"] ?? "",
                password: oldConfig["autoLogin.password"] ?? "",
            },
            [ConfigKey.RemoveLoadingVideoEnabled]: oldConfig["removeLoadingVideo.enabled"],
            [ConfigKey.ViewInBrowserEnabled]: oldConfig["viewInBrowser.enabled"],
            [ConfigKey.CheckNotesOnSubmittingEnabled]: oldConfig["checkNotesOnSubmitting.enabled"],
            [ConfigKey.MoreVisibleRemainingTimeEnabled]: oldConfig["moreVisibleRemainingTime.enabled"],
            [ConfigKey.FixPortalLinkEnabled]: oldConfig["disableRateLimit.enabled"],
            [ConfigKey.CourseOverviewEnabled]: oldConfig["courseOverview.enabled"],
            [ConfigKey.CourseOverviewSelectedYearTerm]: oldConfig["timetable.selectedTerm"],
            [ConfigKey.CourseOverviewAppearanceOptions]: {
                ...CONFIG_DEFAULT_VALUES[ConfigKey.CourseOverviewAppearanceOptions],
                showPeriodTime:
                    oldConfig["timetable.showPeriodTime"] ??
                    CONFIG_DEFAULT_VALUES[ConfigKey.CourseOverviewAppearanceOptions].showPeriodTime,
            },
            [ConfigKey.FixSyllabusLinkEnabled]: oldConfig["syllabusLinkFix.enabled"],
            [ConfigKey.TimetableData]:
                oldConfig["courseData"] &&
                Object.fromEntries(
                    Object.entries(oldConfig["courseData"])
                        .map(([key, value]) => {
                            const courseDataEntry = value as CourseDataEntry;
                            if (!courseDataEntry.timetableData) return [key, undefined];
                            return [
                                key,
                                courseDataEntry.timetableData.map((timetableData) => ({
                                    year: timetableData.yearTerm.year,
                                    term: timetableData.yearTerm.term,
                                    day: timetableData.dayPeriod.day,
                                    period: {
                                        from: timetableData.dayPeriod.period.from,
                                        toInclusive: timetableData.dayPeriod.period.to,
                                    },
                                    classroom: "",
                                })),
                            ];
                        })
                        .filter(([, value]) => value !== undefined)
                ),
            [ConfigKey.CourseSyllabusKeys]:
                oldConfig["courseData"] &&
                Object.fromEntries(
                    Object.entries(oldConfig["courseData"])
                        .map(([key, value]) => {
                            try {
                                const syllabusUrl = new URL((value as CourseDataEntry).syllabusUrl ?? "");
                                return [key, syllabusUrl.searchParams.get("pKey")];
                            } catch (e) {
                                return [key, undefined];
                            }
                        })
                        .filter(([, value]) => value !== undefined)
                ),
            [ConfigKey.CourseNotes]:
                oldConfig["courseData"] &&
                Object.fromEntries(
                    Object.entries(oldConfig["courseData"])
                        .map(([key, value]) => {
                            const courseDataEntry = value as CourseDataEntry;
                            return [key, courseDataEntry.note];
                        })
                        .filter(([, value]) => !!value)
                ),
            [ConfigKey.RemindUnansweredQuestionsEnabled]: oldConfig["quiz.remindUnansweredQuestions.enabled"],
            [ConfigKey.RemindUnansweredQuestionsOnlySequentialQuiz]:
                oldConfig["quiz.remindUnansweredQuestions.sequentialQuizOnly"],
            [ConfigKey.CheckSessionEnabled]: oldConfig["checkSession.enabled"],
            [ConfigKey.TimelineEnabled]: oldConfig["todo.enabled"],
            [ConfigKey.TimelineHiddenEventIds]: oldConfig["todo.hiddenItems"]?.ids,
            [ConfigKey.TimelineHiddenCourses]: oldConfig["todo.hiddenItems"]?.courses,
            [ConfigKey.TimelineHiddenModuleNames]: oldConfig["todo.hiddenItems"]?.modules,
        };

        console.info("Migrated config from under v0.5.0 to v0.6.0", { oldConfig, newConfig });
    } else {
        newConfig = {
            ...newConfig,
            ...Object.fromEntries(
                Object.entries(await browser.storage.sync.get())
                    .filter(([key]) => key !== ConfigKey.LastVersion.toString())
                    .map(([key, value]) => [
                        key,
                        decompressObject(CONFIG_VALUE_TYPE_DEF[key as unknown as ConfigKey], value as any),
                    ])
            ),
        };
    }

    await browser.storage.local.clear();
    await browser.storage.sync.clear();
    const compressedNewConfig: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(newConfig)) {
        if (value === undefined || equal(value, CONFIG_DEFAULT_VALUES[key as unknown as ConfigKey])) {
            continue;
        }
        compressedNewConfig[key.toString()] = compressObject(
            CONFIG_VALUE_TYPE_DEF[key as unknown as ConfigKey],
            value as any
        );
    }
    await browser.storage.sync.set(compressedNewConfig);
}
