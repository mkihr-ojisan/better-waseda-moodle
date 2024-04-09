import { DayOfWeek, Term, TimetableData } from "@/common/course/timetable";
import { InvalidResponseError } from "@/common/error";
import { fetchHTML, postMultipartFormData } from "@/common/util/fetch";
import { zenkaku2hankaku } from "@/common/util/zenkaku";

/** シラバスの検索クエリ */
export type SyllabusSearchQuery = {
    /** キーワード */
    keywords?: string;
    /** 科目名 */
    courseTitle?: string;
    /** 教員名 */
    instructor?: string;
    /** 学期 */
    term?: SyllabusTerm;
    /** 曜日 */
    day?: SyllabusDay;
    /** 時限 */
    period?: SyllabusPeriod;
    /** 授業で使用する言語 */
    language?: SyllabusLanguage;
    /** 授業方法区分 */
    classModalityCategories?: SyllabusClassModalityCategory[];
    /** オープン科目 */
    isOpenCourse?: boolean;
    /** 学部 */
    school?: SyllabusSchool;
    /** 検索結果の言語 */
    resultLanguage: "jp" | "en";
};

/** 過年度シラバスの検索クエリ */
export type OldSyllabusSearchQuery = {
    /** 開講年度 */
    year?: number;
    /** キーワード */
    keywords?: string;
    /** 科目名 */
    courseTitle?: string;
    /** 教員名 */
    instructor?: string;
    /** 授業で使用する言語 */
    language?: SyllabusLanguage;
    /** オープン科目 */
    isOpenCourse?: boolean;
    /** 学部 */
    school?: SyllabusSchool;
    /** 検索結果の言語 */
    resultLanguage: "jp" | "en";
};

export enum SyllabusTerm {
    Unspecified = "",
    FullYear = "0",
    SpringOrSummer = "1",
    FallOrWinter = "2",
    Other = "9",
}

export enum SyllabusDay {
    Unspecified = "",
    Monday = "1",
    Tuesday = "2",
    Wednesday = "3",
    Thursday = "4",
    Friday = "5",
    Saturday = "6",
    Sunday = "7",
    None = "9",
}

export enum SyllabusPeriod {
    Unspecified = "",
    Period1 = "11",
    Period2 = "22",
    Period3 = "33",
    Period4 = "44",
    Period5 = "55",
    Period6 = "66",
    Period7 = "77",
    FullOnDemand = "88",
    Other = "99",
}

export enum SyllabusLanguage {
    Unspecified = "",
    NotAvailable = "00",
    Japanese = "01",
    English = "02",
    JapaneseAndEnglish = "03",
    German = "04",
    French = "05",
    Chinese = "06",
    Spanish = "07",
    Korean = "08",
    Russian = "09",
    Italian = "10",
    EnglishAndSpanish = "11",
    EnglishAndChinese = "12",
    EnglishAndFrench = "13",
    EnglishAndKorean = "14",
    Other = "99",
}

export enum SyllabusClassModalityCategory {
    OnCampus = "【対面】",
    OnCampusHybridOver50Percent = "【対面】ハイブリッド（対面回数半数以上）",
    OnlineHybridUnder50Percent = "【オンライン】ハイブリッド（対面回数半数未満）",
    OnlineFullOnDemand = "【オンライン】フルオンデマンド",
    OnlineRealtimeStreaming = "【オンライン】リアルタイム配信",
    EmergencyHybrid = "【非常時】ハイブリッド",
    EmergencyFullOnDemand = "【非常時】フルオンデマンド",
    EmergencyRealtimeStreaming = "【非常時】リアルタイム配信",

    // old
    Hybrid = "ハイブリッド（対面／オンライン併用）",
    FullOnDemand = "フルオンデマンド（曜日時限なし）",
    OnDemand = "オンデマンド（曜日時限あり）",
    RealtimeStreaming = "リアルタイム配信",
}

export enum SyllabusSchool {
    Unspecified = "",
    政経 = "111973",
    法学 = "121973",
    教育 = "151949",
    商学 = "161973",
    社学 = "181966",
    人科 = "192000",
    スポーツ = "202003",
    国際教養 = "212004",
    文構 = "232006",
    文 = "242006",
    人通 = "252020",
    基幹 = "262006",
    創造 = "272006",
    先進 = "282006",
    政研 = "311951",
    経研 = "321951",
    法研 = "331951",
    文研 = "342002",
    商研 = "351951",
    教研 = "371990",
    人研 = "381991",
    社学研 = "391994",
    アジア研 = "402003",
    日研 = "432001",
    情シス研 = "442003",
    法務研 = "472004",
    会計研 = "482005",
    スポーツ研 = "502005",
    基幹研 = "512006",
    創造研 = "522006",
    先進研 = "532006",
    環エネ研 = "542006",
    国際コミ研 = "562012",
    経管研 = "572015",
    芸術 = "712001",
    日本語 = "922006",
    留学 = "982007",
    グローバル = "9S2013",
}

export type SyllabusSearchResult = {
    /** 開講年度 */
    year?: number;
    /** コース・コード */
    courseCode?: string;
    /** 科目名 */
    courseTitle?: string;
    /** 担当教員 */
    instructors: string[];
    /** 開講学部 */
    school?: string;
    /** 学期 */
    term?: string;
    /** 曜日時限 */
    dayPeriod?: string;
    /** 使用教室 */
    classroom?: string;
    /** 授業概要 */
    courseDescriptionShort?: string;
    /** シラバスのURL */
    url?: string;
    /** シラバスを一意に識別するキー */
    key: string;
};

/**
 * シラバスを検索する
 *
 * @param query - 検索クエリ
 * @yields シラバスの検索結果
 */
export async function* searchSyllabus(query: SyllabusSearchQuery): AsyncGenerator<SyllabusSearchResult[]> {
    for (let i = 1; ; i++) {
        const form: [string, string][] = [
            ["p_number", "100"],
            ["p_page", i === 1 ? "" : i.toString()],
            ["pfrontPage", "now"],
            ["keyword", query.keywords ?? ""],
            ["kamoku", query.courseTitle ?? ""],
            ["kyoin", query.instructor ?? ""],
            ["p_gakki", query.term ?? ""],
            ["p_youbi", query.day ?? ""],
            ["p_jigen", query.period ?? ""],
            ["p_gengo", query.language ?? ""],
            [
                "p_jyugyohoho",
                (() => {
                    if (!query.classModalityCategories || query.classModalityCategories.length === 0) {
                        return "";
                    }

                    let str = `a:${query.classModalityCategories.length}{`;
                    for (let i = 0; i < query.classModalityCategories.length; i++) {
                        const cat = query.classModalityCategories[i];
                        if (
                            cat === SyllabusClassModalityCategory.Hybrid ||
                            cat === SyllabusClassModalityCategory.FullOnDemand ||
                            cat === SyllabusClassModalityCategory.OnDemand ||
                            cat === SyllabusClassModalityCategory.RealtimeStreaming
                        ) {
                            throw new Error("specified old class modality category");
                        }

                        const s = {
                            [SyllabusClassModalityCategory.OnCampus]: "12",
                            [SyllabusClassModalityCategory.OnCampusHybridOver50Percent]: "60",
                            [SyllabusClassModalityCategory.OnlineHybridUnder50Percent]: "69",
                            [SyllabusClassModalityCategory.OnlineFullOnDemand]: "45",
                            [SyllabusClassModalityCategory.OnlineRealtimeStreaming]: "45",
                            [SyllabusClassModalityCategory.EmergencyHybrid]: "33",
                            [SyllabusClassModalityCategory.EmergencyFullOnDemand]: "39",
                            [SyllabusClassModalityCategory.EmergencyRealtimeStreaming]: "39",
                        }[cat];
                        str += `i:${i};s:${s}:"${query.classModalityCategories[i]}";`;
                    }
                    str += "}";

                    return str;
                })(),
            ],
            ["p_gakubu", query.school ?? ""],
            ["p_keya", ""],
            ["p_keyb", ""],
            ["p_keyc", ""],
            ["p_searcha", "a"],
            ["p_searchb", "b"],
            ["p_searchc", ""],
            ["nendo", ""],
            ["pYear", ""],
            ["pSchl", ""],
            ["pClsOpnSts", "123"],
            ["pKyoincd", ""],
            ["pKey", ""],
            ["bunya1_hid", ""],
            ["bunya2_hid", ""],
            ["bunya3_hid", ""],
            ["level_hid", ""],
            ["ControllerParameters", "JAA103SubCon"],
            ["pOcw", ""],
            ["pType", ""],
            ["pLng", query.resultLanguage],
        ];
        if (query.isOpenCourse) {
            form.push(["p_open[]", "0"]);
        }

        const response = await postMultipartFormData("https://www.wsl.waseda.jp/syllabus/index.php", form);
        const doc = new DOMParser().parseFromString(await response.text(), "text/html");

        const message = doc.getElementsByClassName("ch-message")[0]?.textContent?.trim();
        if (message === "検索結果は0件です。" || message === "0 Search Result") {
            // 検索結果は0件です。
            yield [];
            return;
        }

        const table = doc.getElementsByClassName("ct-vh")[0];
        if (!table) throw new InvalidResponseError("ct-vh not found");

        const result: SyllabusSearchResult[] = [];

        const rows = table.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");

            const key = cells[2]
                .getElementsByTagName("a")[0]
                ?.getAttribute("onclick")
                ?.match(/post_submit\('JAA104DtlSubCon', '(.*)'\)/)?.[1];

            if (!key) throw new InvalidResponseError("key not found");

            result.push({
                year: parseInt(cells[0].textContent?.trim() ?? "") ?? undefined,
                courseCode: cells[1].textContent?.trim(),
                courseTitle: cells[2].textContent?.trim(),
                instructors: cells[3].textContent?.trim().split("／") ?? [],
                school: cells[4].textContent?.trim(),
                term: cells[5].textContent?.trim(),
                dayPeriod: cells[6].textContent?.trim(),
                classroom: cells[7].textContent?.trim(),
                courseDescriptionShort: cells[8].textContent?.trim(),
                url: getURLFromKey(key, query.resultLanguage),
                key,
            });
        }

        yield result;

        if (result.length < 100) break;
    }
}

/**
 * 過年度のシラバスを検索する
 *
 * @param query - 検索クエリ
 * @yields シラバスの検索結果
 */
export async function* searchOldSyllabus(query: OldSyllabusSearchQuery): AsyncGenerator<SyllabusSearchResult[]> {
    for (let i = 1; ; i++) {
        const form: [string, string][] = [
            ["p_number", "100"],
            ["p_page", i === 1 ? "" : i.toString()],
            ["pfrontPage", "past"],
            ["keyword", query.keywords ?? ""],
            ["kamoku", query.courseTitle ?? ""],
            ["kyoin", query.instructor ?? ""],
            ["p_gakki", ""],
            ["p_youbi", ""],
            ["p_jigen", ""],
            ["p_gengo", query.language ?? ""],
            ["p_jyugyohoho", ""],
            ["p_open", ""],
            ["p_gakubu", query.school ?? ""],
            ["p_keya", ""],
            ["p_keyb", ""],
            ["p_keyc", ""],
            ["p_searcha", "a"],
            ["p_searchb", "b"],
            ["p_searchc", ""],
            ["nendo", query.year?.toString() ?? ""],
            ["pYear", ""],
            ["pSchl", ""],
            ["pClsOpnSts", "0"],
            ["pKyoincd", ""],
            ["pKey", ""],
            ["bunya1_hid", ""],
            ["bunya2_hid", ""],
            ["bunya3_hid", ""],
            ["level_hid", ""],
            ["ControllerParameters", "JAA103SubCon"],
            ["pOcw", ""],
            ["pType", ""],
            ["pLng", query.resultLanguage],
        ];
        if (query.isOpenCourse) {
            form.push(["p_open[]", "0"]);
        }

        const response = await postMultipartFormData("https://www.wsl.waseda.jp/syllabus/index.php", form);
        const doc = new DOMParser().parseFromString(await response.text(), "text/html");

        const message = doc.getElementsByClassName("ch-message")[0]?.textContent?.trim();
        if (message === "検索結果は0件です。" || message === "0 Search Result") {
            // 検索結果は0件です。
            yield [];
            return;
        }

        const table = doc.getElementsByClassName("ct-vh")[0];
        if (!table) throw new InvalidResponseError("ct-vh not found");

        const result: SyllabusSearchResult[] = [];

        const rows = table.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");

            const key = cells[2]
                .getElementsByTagName("a")[0]
                ?.getAttribute("onclick")
                ?.match(/post_submit\('JAA104DtlSubCon', '(.*)'\)/)?.[1];

            if (!key) throw new InvalidResponseError("key not found");

            result.push({
                year: parseInt(cells[0].textContent?.trim() ?? "") ?? undefined,
                courseCode: cells[1].textContent?.trim(),
                courseTitle: cells[2].textContent?.trim(),
                instructors: cells[3].textContent?.trim().split("／") ?? [],
                school: cells[4].textContent?.trim(),
                term: cells[5].textContent?.trim(),
                dayPeriod: cells[6].textContent?.trim(),
                classroom: cells[7].textContent?.trim(),
                courseDescriptionShort: cells[8].textContent?.trim(),
                url: getURLFromKey(key, query.resultLanguage),
                key,
            });
        }

        yield result;

        if (result.length < 100) break;
    }
}

export type Syllabus = {
    /** シラバスを一意に識別するキー */
    key: string;
    /** 授業情報 */
    courseInformation: {
        /** 開講年度 */
        year?: number;
        /** 開講箇所 */
        school?: string;
        /** 科目名 */
        courseTitle?: string;
        /** 担当教員 */
        instructors?: string[];
        /** 学期 */
        term?: Term;
        /** 曜日・時限 */
        dayPeriods?: {
            day: DayOfWeek;
            period: {
                from: number;
                toInclusive: number;
            };
        }[];
        /** 科目区分 */
        category?: string;
        /** 配当年次 */
        eligibleYear?: string;
        /** 単位数 */
        credits?: number;
        /** 使用教室 */
        classroom?: string[];
        /** 早稲田 */
        campus?: string;
        /** 科目キー */
        courseKey?: string;
        /** 科目クラスコード */
        courseClassCode?: string;
        /** 授業で使用する言語 */
        mainLanguage?: string;
        /** 授業方法区分 */
        classModalityCategories?: SyllabusClassModalityCategory | undefined;
        /** コース・コード */
        courseCode?: string;
        /** 大分野名称 */
        firstAcademicDisciplines?: string;
        /** 中分野名称 */
        secondAcademicDisciplines?: string;
        /** 小分野名称 */
        thirdAcademicDisciplines?: string;
        /** レベル */
        level?: string;
        /** 授業形態 */
        typesOfLesson?: string;
    };
    /** シラバス情報 */
    // syllabusInformation: {
    //     /** 副題 */
    //     subtitle: string;
    //     /** 授業概要 */
    //     courseOutline: string;
    //     /** 授業の到達目標 */
    //     objectives: string;
    //     /** 事前・事後学習の内容 */
    //     beforeOrAfterCourseOfStudy: string;
    //     /** 授業計画 */
    //     courseSchedule: string;
    //     /** 教科書 */
    //     textbooks: string;
    //     /** 参考文献 */
    //     reference: string;
    //     /** 成績評価方法 */
    //     evaluation: string;
    //     /** 備考・関連URL */
    //     noteAndURL: string;
    // };
};

/**
 * 指定したキーのシラバスを取得する。
 *
 * @param key - シラバスのキー
 * @param language - 言語
 */
export async function fetchSyllabus(key: string, language: "jp" | "en"): Promise<Syllabus> {
    const doc = await fetchHTML(`https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=${language}`);
    return parseSyllabus(key, doc);
}

/**
 * シラバスのHTMLからシラバス情報を取得する。
 *
 * @param key - シラバスのキー
 * @param doc - シラバスのHTML
 * @returns シラバス
 */
export function parseSyllabus(key: string, doc: Document): Syllabus {
    const courseInfoTable = doc.getElementsByClassName("ct-common")[0];

    const courseInformation: Syllabus["courseInformation"] = {};
    for (const th of Array.from(courseInfoTable.getElementsByTagName("th"))) {
        const key = th.textContent?.trim();

        if (!th.nextElementSibling || th.nextElementSibling.nodeName.toUpperCase() !== "TD") continue;
        const value = th.nextElementSibling.textContent?.trim() ?? "";

        switch (key) {
            case "開講年度":
            case "Year":
                courseInformation.year = parseInt(value.replace("年度", "")) || undefined;
                break;
            case "開講箇所":
            case "School":
                courseInformation.school = value;
                break;
            case "科目名":
            case "Course Title":
                courseInformation.courseTitle = value;
                break;
            case "担当教員":
            case "Instructor":
                courseInformation.instructors = value.split("／");
                break;
            case "学期曜日時限":
            case "Term/Day/Period": {
                const termDayPeriod = value.split("\xa0\xa0");

                switch (termDayPeriod[0]) {
                    case "春クォーター":
                    case "spring quarter":
                        courseInformation.term = Term.SPRING_QUARTER;
                        break;
                    case "夏クォーター":
                    case "summer quarter":
                        courseInformation.term = Term.SUMMER_QUARTER;
                        break;
                    case "秋クォーター":
                    case "fall quarter":
                        courseInformation.term = Term.FALL_QUARTER;
                        break;
                    case "冬クォーター":
                    case "winter quarter":
                        courseInformation.term = Term.WINTER_QUARTER;
                        break;
                    case "春学期":
                    case "spring semester":
                        courseInformation.term = Term.SPRING_SEMESTER;
                        break;
                    case "秋学期":
                    case "fall semester":
                        courseInformation.term = Term.FALL_SEMESTER;
                        break;
                    case "通年":
                    case "full year":
                        courseInformation.term = Term.FULL_YEAR;
                        break;
                    default:
                        console.warn(`unknown term '${termDayPeriod[0]}'`);
                }

                let dayPeriodStrings: string[];
                if (termDayPeriod[1].includes("／")) {
                    dayPeriodStrings = termDayPeriod[1].split("／").map((s) => s.substring(s.indexOf(":") + 1));
                } else {
                    dayPeriodStrings = [termDayPeriod[1]];
                }
                courseInformation.dayPeriods = dayPeriodStrings.flatMap((s) => {
                    let day: DayOfWeek, period: { from: number; toInclusive: number };
                    if (s.includes(".")) {
                        const dayPeriod = s.split(".");
                        switch (dayPeriod[0]) {
                            case "Mon":
                                day = DayOfWeek.MONDAY;
                                break;
                            case "Tues":
                                day = DayOfWeek.TUESDAY;
                                break;
                            case "Wed":
                                day = DayOfWeek.WEDNESDAY;
                                break;
                            case "Thur":
                                day = DayOfWeek.THURSDAY;
                                break;
                            case "Fri":
                                day = DayOfWeek.FRIDAY;
                                break;
                            case "Sat":
                                day = DayOfWeek.SATURDAY;
                                break;
                            case "Sun":
                                day = DayOfWeek.SUNDAY;
                                break;
                            default:
                                console.warn(`unknown day '${dayPeriod[0]}'`);
                                return [];
                        }
                        const strPeriod = dayPeriod[1].split("-");
                        period = {
                            from: parseInt(strPeriod[0]),
                            toInclusive: parseInt(strPeriod[1] ?? strPeriod[0]),
                        };
                    } else {
                        switch (s[0]) {
                            case "月":
                                day = DayOfWeek.MONDAY;
                                break;
                            case "火":
                                day = DayOfWeek.TUESDAY;
                                break;
                            case "水":
                                day = DayOfWeek.WEDNESDAY;
                                break;
                            case "木":
                                day = DayOfWeek.THURSDAY;
                                break;
                            case "金":
                                day = DayOfWeek.FRIDAY;
                                break;
                            case "土":
                                day = DayOfWeek.SATURDAY;
                                break;
                            case "日":
                                day = DayOfWeek.SUNDAY;
                                break;
                            default:
                                console.warn(`unknown day '${s[0]}'`);
                                return [];
                        }
                        const strPeriod = s.substring(1).split("-");
                        const strPeriodMap: Record<string, number> = {
                            "１": 1,
                            "２": 2,
                            "３": 3,
                            "４": 4,
                            "５": 5,
                            "６": 6,
                            "７": 7,
                        };
                        const from = strPeriodMap[strPeriod[0][0]];
                        if (!from) throw new InvalidResponseError(`unknown period '${strPeriod[0][0]}'`);
                        const toInclusive = strPeriodMap[strPeriod[1]?.[0] ?? strPeriod[0][0]];
                        if (!toInclusive)
                            throw new InvalidResponseError(`unknown period '${strPeriod[1]?.[0] ?? strPeriod[0][0]}'`);
                        period = { from, toInclusive };
                    }
                    return [{ day, period }];
                });
                break;
            }
            case "科目区分":
            case "Category":
                courseInformation.category = value;
                break;
            case "配当年次":
            case "Eligible Year":
                courseInformation.eligibleYear = value;
                break;
            case "単位数":
            case "Credits":
                courseInformation.credits = parseInt(value) || undefined;
                break;
            case "使用教室":
            case "Classroom":
                if (value.includes("／")) {
                    courseInformation.classroom = value.split("／").map((s) => s.substring(s.indexOf(":") + 1));
                } else {
                    courseInformation.classroom = [value];
                }
                break;
            case "キャンパス":
            case "Campus":
                courseInformation.campus = value;
                break;
            case "科目キー":
            case "Course Key":
                courseInformation.courseKey = value;
                break;
            case "科目クラスコード":
            case "Course Class Code":
                courseInformation.courseClassCode = value;
                break;
            case "授業で使用する言語":
            case "Main Language":
                courseInformation.mainLanguage = value;
                break;
            case "授業方法区分":
            case "Class Modality Categories":
                courseInformation.classModalityCategories = {
                    "[On-campus]": SyllabusClassModalityCategory.OnCampus,
                    "【対面】": SyllabusClassModalityCategory.OnCampus,
                    "[On-campus] Hybrid (over 50% of classes on-campus)":
                        SyllabusClassModalityCategory.OnCampusHybridOver50Percent,
                    "【対面】ハイブリッド（対面回数半数以上）":
                        SyllabusClassModalityCategory.OnCampusHybridOver50Percent,
                    "[Online] Hybrid (under 50% of classes on-campus)":
                        SyllabusClassModalityCategory.OnlineHybridUnder50Percent,
                    "【オンライン】ハイブリッド（対面回数半数未満）":
                        SyllabusClassModalityCategory.OnlineHybridUnder50Percent,
                    "[Online] Full On-demand": SyllabusClassModalityCategory.OnlineFullOnDemand,
                    "【オンライン】フルオンデマンド": SyllabusClassModalityCategory.OnlineFullOnDemand,
                    "[Online] Realtime Streaming": SyllabusClassModalityCategory.OnlineRealtimeStreaming,
                    "【オンライン】リアルタイム配信": SyllabusClassModalityCategory.OnlineRealtimeStreaming,
                    "[Emergency] Hybrid": SyllabusClassModalityCategory.EmergencyHybrid,
                    "【非常時】ハイブリッド": SyllabusClassModalityCategory.EmergencyHybrid,
                    "[Emergency] Full On-demand": SyllabusClassModalityCategory.EmergencyFullOnDemand,
                    "【非常時】フルオンデマンド": SyllabusClassModalityCategory.EmergencyFullOnDemand,
                    "[Emergency] Realtime Streaming": SyllabusClassModalityCategory.EmergencyRealtimeStreaming,
                    "【非常時】リアルタイム配信": SyllabusClassModalityCategory.EmergencyRealtimeStreaming,
                    "Hybrid (In-person/Online)": SyllabusClassModalityCategory.Hybrid,
                    "ハイブリッド（対面／オンライン併用）": SyllabusClassModalityCategory.Hybrid,
                    "Full On-demand (No restrictions)": SyllabusClassModalityCategory.FullOnDemand,
                    "フルオンデマンド（曜日時限なし）": SyllabusClassModalityCategory.FullOnDemand,
                    "On-demand (Schedule Restrictions)": SyllabusClassModalityCategory.OnDemand,
                    "オンデマンド（曜日時限あり）": SyllabusClassModalityCategory.OnDemand,
                    "Realtime Streaming": SyllabusClassModalityCategory.RealtimeStreaming,
                    リアルタイム配信: SyllabusClassModalityCategory.OnlineRealtimeStreaming,
                }[value];
                break;
            case "コース・コード":
            case "Course Code":
                courseInformation.courseCode = value;
                break;
            case "大分野名称":
            case "First Academic disciplines":
                courseInformation.firstAcademicDisciplines = value;
                break;
            case "中分野名称":
            case "Second Academic disciplines":
                courseInformation.secondAcademicDisciplines = value;
                break;
            case "小分野名称":
            case "Third Academic disciplines":
                courseInformation.thirdAcademicDisciplines = value;
                break;
            case "レベル":
            case "Level":
                courseInformation.level = value;
                break;
            case "授業形態":
            case "Types of lesson":
                courseInformation.typesOfLesson = value;
                break;
        }
    }

    return { key, courseInformation };
}

/**
 * 過年度シラバス検索の開講年度の選択肢を取得する
 */
export async function fetchOldSyllabusSearchYearList(): Promise<number[]> {
    const doc = await fetchHTML("https://www.wsl.waseda.jp/syllabus/JAA102.php");
    const options = Array.from(doc.getElementById("nendo")?.getElementsByTagName("option") ?? []);
    return options.slice(1).map((option) => parseInt(option.getAttribute("value") ?? "", 10));
}

/**
 * シラバスのキーからURLを生成する
 *
 * @param key - シラバスのキー
 * @param language - 言語
 * @returns シラバスのURL
 */
export function getURLFromKey(key: string, language?: "jp" | "en"): string {
    let url = `https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}`;
    if (language) {
        url += `&pLng=${language}`;
    }
    return url;
}

/**
 * シラバスから時間割データを取得する
 *
 * @param syllabus - シラバス
 * @returns 時間割データ
 */
export function getTimetableDataFromSyllabus(syllabus: Syllabus): TimetableData | undefined {
    if (
        syllabus.courseInformation.dayPeriods &&
        syllabus.courseInformation.dayPeriods.length > 0 &&
        syllabus.courseInformation.year &&
        syllabus.courseInformation.term
    ) {
        const year = syllabus.courseInformation.year;
        const term = syllabus.courseInformation.term;

        return syllabus.courseInformation.dayPeriods.map((dayPeriod, i) => ({
            year,
            term,
            day: dayPeriod.day,
            period: dayPeriod.period,
            classroom: zenkaku2hankaku(syllabus.courseInformation.classroom?.[i] ?? "")
                .replace(/教室$/, "")
                .replace(/室$/, ""),
        }));
    }
}

/**
 * シラバスから授業方法を取得する
 *
 * @param syllabus - シラバス
 * @returns 授業方法
 */
export function getCourseDeliveryMethodFromSyllabus(
    syllabus: Syllabus
): "face_to_face" | "realtime_streaming" | "on_demand" | undefined {
    switch (syllabus.courseInformation.classModalityCategories) {
        case SyllabusClassModalityCategory.OnCampus:
        case SyllabusClassModalityCategory.OnCampusHybridOver50Percent:
        case SyllabusClassModalityCategory.OnlineHybridUnder50Percent:
        case SyllabusClassModalityCategory.EmergencyHybrid:
        case SyllabusClassModalityCategory.Hybrid:
            return "face_to_face";
        case SyllabusClassModalityCategory.OnlineFullOnDemand:
        case SyllabusClassModalityCategory.EmergencyFullOnDemand:
        case SyllabusClassModalityCategory.FullOnDemand:
        case SyllabusClassModalityCategory.OnDemand:
            return "on_demand";
        case SyllabusClassModalityCategory.OnlineRealtimeStreaming:
        case SyllabusClassModalityCategory.EmergencyRealtimeStreaming:
        case SyllabusClassModalityCategory.RealtimeStreaming:
            return "realtime_streaming";
    }
}
