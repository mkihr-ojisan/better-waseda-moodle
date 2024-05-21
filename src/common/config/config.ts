import equal from "fast-deep-equal";
import { compressObject, decompressObject, TypeDef, TypeOfTypeDef } from "../../common/util/object-compression";
import { getCurrentExtensionContext } from "../util/context";
import { call } from "../util/messenger/client";

/** configのキーを列挙する。互換性がなくなるので値は変えないほうが良い。512個まで */
export enum ConfigKey {
    /** 拡張機能が最後に起動したときのバージョン */
    LastVersion = 0,
    /** 非表示にしたヒント */
    HiddenTips = 13,
    /** 開発者モード */
    DevMode = 40,

    // ========自動ログイン========
    /** ログインID・パスワード */
    LoginInfo = 1,
    /** 自動ログインが有効かどうか */
    AutoLoginEnabled = 2,

    // ========科目情報など========
    /** 時間割情報 */
    TimetableData = 6,
    /** 各科目のシラバスのキー */
    CourseSyllabusKeys = 8,
    /** 各科目の授業実施方法（対面・オンラインなど） */
    CourseDeliveryMethods = 9,
    /** 変更した科目名 */
    CourseNameOverrides = 10,
    /** 科目の色 */
    CourseColor = 11,
    /** 各科目の配信URL */
    CourseStreamingURLs = 12,

    // ========コース概要========
    /** コース概要の機能が有効かどうか */
    CourseOverviewEnabled = 3,
    /** （削除済み）ダッシュボードからの無駄なリクエストをブロックしてサーバー負荷を低減するオプション */
    BlockDashboardRequest = 4,
    /** コース概要で最後に選択された年度・学期 */
    CourseOverviewSelectedYearTerm = 7,
    /** コース概要の外観の設定 */
    CourseOverviewAppearanceOptions = 28,
    /** コースのメモ */
    CourseNotes = 30,
    /** ユーザーが追加したコース */
    CustomCourses = 37,
    /** カスタム科目と同じ科目がMoodleに追加されたときに自動的に統合するかどうか */
    MergeCustomCourses = 41,
    /** 入学年度より前のタブを非表示にする */
    HideTabsBeforeEnrollment = 47,

    // ========小テスト========
    /** 小テストの残り時間を見やすくする機能が有効かどうか */
    MoreVisibleRemainingTimeEnabled = 16,
    /** 小テストで解答していない問題がある場合に確認する機能が有効かどうか */
    RemindUnansweredQuestionsEnabled = 19,
    /** 小テストで解答していない問題がある場合に確認する機能で、前に戻れない小テストでのみ確認するかどうか */
    RemindUnansweredQuestionsOnlySequentialQuiz = 20,

    // ========スタイル修正========
    /** 科目の内容の余白を減らす */
    ReduceCourseContentPaddingEnabled = 31,
    /** フローティングアクションボタンを削除する */
    RemoveFloatingActionButtonsEnabled = 32,
    /** 通知バッジを削除する */
    RemoveNotificationBadgeEnabled = 33,

    // ========タイムライン========
    /** タイムラインの機能が有効かどうか */
    TimelineEnabled = 29,
    /** タイムラインで遡る期間 */
    TimelineBackwardDays = 22,
    /** タイムラインで先のイベント表示する期間 */
    TimelineForwardDays = 23,
    /** タイムラインで非表示にするイベントID */
    TimelineHiddenEventIds = 24,
    /** タイムラインで非表示にする科目ID */
    TimelineHiddenCourses = 25,
    /** タイムラインで非表示にするイベントの種類 */
    TimelineHiddenModuleNames = 26,
    /** タイムラインで日付を表示するとき、日付の境界のオフセット(ミリ秒単位) */
    TimelineDateBorderOffset = 27,
    /** タイムラインに期限が近いイベントがある場合にアイコンにバッジを表示する機能 */
    TimelineBadgeEnabled = 42,
    /** バッジに表示する期限の範囲 */
    TimelineBadgeDeadlineRange = 43,
    /** ダッシュボードにタイムラインを表示するかどうか */
    TimelineShowInDashboard = 44,

    // ========その他の機能========
    /** ファイルを保存せずにブラウザで表示する機能が有効かどうか */
    ViewInBrowserEnabled = 14,
    /** ローディング動画を削除する機能が有効かどうか */
    RemoveLoadingVideoEnabled = 5,
    /** 課題提出時の注意事項にチェックを入れる機能が有効かどうか */
    CheckNotesOnSubmittingEnabled = 15,
    /** 成績照会・科目登録専用メニューのリンクを修正する機能が有効かどうか */
    FixPortalLinkEnabled = 17,
    /** シラバスのリンクを修正する機能が有効かどうか */
    FixSyllabusLinkEnabled = 18,
    /** 小テスト等の提出前にセッションを確認する機能が有効かどうか */
    CheckSessionEnabled = 21,
    /** セッションを自動的に延長する機能が有効かどうか */
    AutoSessionExtensionEnabled = 34,
    /** 課題提出時にファイル名を自動的に変更する機能が有効かどうか */
    AssignmentFilenameEnabled = 35,
    /** 課題提出時にファイル名を自動的に変更する機能で使用するファイル名のパターン */
    AssignmentFilenameTemplate = 36,
    /** 課題提出時にファイル名を自動的に変更する機能で使用するファイル名のパターン(科目ごと) */
    AssignmentFilenameTemplateCourse = 39,
    /** IntelliBoardのトラッキングをブロックする */
    BlockTracking = 38,
    /** 文字数カウンターを有効にする */
    WordCounterEnabled = 45,
    /** unloadイベントを無効化する */
    FasterBackAndForward = 46,
}

/** configの値の型を定義する。オブジェクトを圧縮するのに使用する。 */
export const CONFIG_VALUE_TYPE_DEF = {
    [ConfigKey.LastVersion]: "string",
    [ConfigKey.HiddenTips]: {
        arrayElements: {
            enumItems: [
                "no_timetable_data",
                "hide_course",
                "hide_timeline_event_popup",
                "hide_timeline_event_dashboard",
                "timeline_warning",
            ],
        },
    },
    [ConfigKey.DevMode]: "boolean",
    [ConfigKey.LoginInfo]: {
        objectEntries: [
            ["userId", "string"],
            ["password", "string"],
        ],
    },
    [ConfigKey.AutoLoginEnabled]: "boolean",
    [ConfigKey.TimetableData]: {
        recordValues: {
            arrayElements: {
                objectEntries: [
                    ["year", "number"],
                    [
                        "term",
                        {
                            enumItems: [
                                "spring_quarter",
                                "summer_quarter",
                                "fall_quarter",
                                "winter_quarter",
                                "spring_semester",
                                "fall_semester",
                                "full_year",
                            ],
                        },
                    ],
                    [
                        "day",
                        {
                            enumItems: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
                        },
                    ],
                    [
                        "period",
                        {
                            objectEntries: [
                                ["from", "number"],
                                ["toInclusive", "number"],
                            ],
                        },
                    ],
                    ["classroom", "string"],
                ],
            },
        },
    },
    [ConfigKey.CourseSyllabusKeys]: {
        recordValues: "string",
    },
    [ConfigKey.CourseDeliveryMethods]: {
        recordValues: {
            enumItems: ["face_to_face", "realtime_streaming", "on_demand"],
        },
    },
    [ConfigKey.CourseNameOverrides]: {
        recordValues: "string",
    },
    [ConfigKey.CourseColor]: {
        recordValues: "string",
    },
    [ConfigKey.CourseStreamingURLs]: {
        recordValues: "string",
    },
    [ConfigKey.CourseOverviewEnabled]: "boolean",
    [ConfigKey.BlockDashboardRequest]: "boolean",
    [ConfigKey.CourseOverviewSelectedYearTerm]: {
        nullable: {
            objectEntries: [
                ["year", "number"],
                [
                    "term",
                    {
                        enumItems: [
                            "spring_quarter",
                            "summer_quarter",
                            "fall_quarter",
                            "winter_quarter",
                            "spring_semester",
                            "fall_semester",
                            "full_year",
                        ],
                    },
                ],
            ],
        },
    },
    [ConfigKey.CourseOverviewAppearanceOptions]: {
        objectEntries: [
            ["emphasizeCurrentDayAndPeriod", "boolean"],
            ["showPeriodTime", "boolean"],
            ["showCourseDeliveryMethod", "boolean"],
            ["showCourseTags", "boolean"],
            ["showCourseColor", "boolean"],
            ["showCourseNote", "boolean"],
            ["showCourseMenu", "boolean"],
        ],
    },
    [ConfigKey.CourseNotes]: {
        recordValues: "string",
    },
    [ConfigKey.CustomCourses]: {
        arrayElements: {
            objectEntries: [
                ["id", "string"],
                ["name", "string"],
                ["url", { nullable: "string" }],
                ["hidden", "boolean"],
                ["courseKey", { nullable: "string" }],
            ],
        },
    },
    [ConfigKey.MergeCustomCourses]: "boolean",
    [ConfigKey.HideTabsBeforeEnrollment]: "boolean",
    [ConfigKey.MoreVisibleRemainingTimeEnabled]: "boolean",
    [ConfigKey.RemindUnansweredQuestionsEnabled]: "boolean",
    [ConfigKey.RemindUnansweredQuestionsOnlySequentialQuiz]: "boolean",
    [ConfigKey.ReduceCourseContentPaddingEnabled]: "boolean",
    [ConfigKey.RemoveFloatingActionButtonsEnabled]: "boolean",
    [ConfigKey.RemoveNotificationBadgeEnabled]: "boolean",
    [ConfigKey.TimelineEnabled]: "boolean",
    [ConfigKey.TimelineBackwardDays]: "number",
    [ConfigKey.TimelineForwardDays]: "number",
    [ConfigKey.TimelineHiddenEventIds]: {
        arrayElements: "number",
    },
    [ConfigKey.TimelineHiddenCourses]: {
        arrayElements: "string",
    },
    [ConfigKey.TimelineHiddenModuleNames]: {
        arrayElements: "string",
    },
    [ConfigKey.TimelineDateBorderOffset]: "number",
    [ConfigKey.TimelineBadgeEnabled]: "boolean",
    [ConfigKey.TimelineBadgeDeadlineRange]: "number",
    [ConfigKey.TimelineShowInDashboard]: "boolean",
    [ConfigKey.RemoveLoadingVideoEnabled]: "boolean",
    [ConfigKey.ViewInBrowserEnabled]: "boolean",
    [ConfigKey.CheckNotesOnSubmittingEnabled]: "boolean",
    [ConfigKey.FixPortalLinkEnabled]: "boolean",
    [ConfigKey.FixSyllabusLinkEnabled]: "boolean",
    [ConfigKey.CheckSessionEnabled]: "boolean",
    [ConfigKey.AutoSessionExtensionEnabled]: "boolean",
    [ConfigKey.AssignmentFilenameEnabled]: "boolean",
    [ConfigKey.AssignmentFilenameTemplate]: "string",
    [ConfigKey.AssignmentFilenameTemplateCourse]: {
        recordValues: "string",
    },
    [ConfigKey.BlockTracking]: "boolean",
    [ConfigKey.WordCounterEnabled]: "boolean",
    [ConfigKey.FasterBackAndForward]: "boolean",
} as const satisfies Record<ConfigKey, TypeDef>;

export type ConfigValue<T extends ConfigKey> = TypeOfTypeDef<(typeof CONFIG_VALUE_TYPE_DEF)[T]>;

/** configのデフォルト値を指定する。 */
export const CONFIG_DEFAULT_VALUES = {
    [ConfigKey.LastVersion]: "0",
    [ConfigKey.HiddenTips]: [],
    [ConfigKey.DevMode]: process.env.NODE_ENV === "development",
    [ConfigKey.LoginInfo]: { userId: "", password: "" },
    [ConfigKey.AutoLoginEnabled]: false,
    [ConfigKey.TimetableData]: {},
    [ConfigKey.CourseSyllabusKeys]: {},
    [ConfigKey.CourseDeliveryMethods]: {},
    [ConfigKey.CourseNameOverrides]: {},
    [ConfigKey.CourseColor]: {},
    [ConfigKey.CourseStreamingURLs]: {},
    [ConfigKey.CourseOverviewEnabled]: true,
    [ConfigKey.BlockDashboardRequest]: false,
    [ConfigKey.CourseOverviewSelectedYearTerm]: null,
    [ConfigKey.CourseOverviewAppearanceOptions]: {
        emphasizeCurrentDayAndPeriod: true,
        showPeriodTime: true,
        showCourseDeliveryMethod: true,
        showCourseTags: true,
        showCourseColor: true,
        showCourseNote: true,
        showCourseMenu: true,
    },
    [ConfigKey.CourseNotes]: {},
    [ConfigKey.CustomCourses]: [],
    [ConfigKey.MergeCustomCourses]: true,
    [ConfigKey.HideTabsBeforeEnrollment]: true,
    [ConfigKey.MoreVisibleRemainingTimeEnabled]: true,
    [ConfigKey.RemindUnansweredQuestionsEnabled]: true,
    [ConfigKey.RemindUnansweredQuestionsOnlySequentialQuiz]: true,
    [ConfigKey.ReduceCourseContentPaddingEnabled]: false,
    [ConfigKey.RemoveFloatingActionButtonsEnabled]: false,
    [ConfigKey.RemoveNotificationBadgeEnabled]: false,
    [ConfigKey.TimelineEnabled]: true,
    [ConfigKey.TimelineBackwardDays]: 14,
    [ConfigKey.TimelineForwardDays]: 365,
    [ConfigKey.TimelineHiddenEventIds]: [],
    [ConfigKey.TimelineHiddenCourses]: [],
    [ConfigKey.TimelineHiddenModuleNames]: [],
    [ConfigKey.TimelineDateBorderOffset]: 0,
    [ConfigKey.TimelineBadgeEnabled]: false,
    [ConfigKey.TimelineBadgeDeadlineRange]: 7 * 24 * 60 * 60 * 1000,
    [ConfigKey.TimelineShowInDashboard]: true,
    [ConfigKey.RemoveLoadingVideoEnabled]: true,
    [ConfigKey.ViewInBrowserEnabled]: false,
    [ConfigKey.CheckNotesOnSubmittingEnabled]: true,
    [ConfigKey.FixPortalLinkEnabled]: true,
    [ConfigKey.FixSyllabusLinkEnabled]: true,
    [ConfigKey.CheckSessionEnabled]: true,
    [ConfigKey.AutoSessionExtensionEnabled]: true,
    [ConfigKey.AssignmentFilenameEnabled]: false,
    [ConfigKey.AssignmentFilenameTemplate]: "1X999999_早稲田太郎_{course}_{assignment}{extension}",
    [ConfigKey.AssignmentFilenameTemplateCourse]: {},
    [ConfigKey.BlockTracking]: false,
    [ConfigKey.WordCounterEnabled]: true,
    [ConfigKey.FasterBackAndForward]: true,
} satisfies { [K in ConfigKey]: ConfigValue<K> };

let cache: any = undefined;
const listeners = new Map<string, ((newValue: any) => void)[]>();

/**
 * configを初期化する。getConfigやsetConfigなどを使用する前に呼び出す必要がある。
 */
export async function initConfig(): Promise<void> {
    // getConfigとsetConfigを同期関数にしたいのでキャッシュする
    if (cache !== undefined) return;
    cache = await browser.storage.sync.get();

    browser.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "sync") return;

        for (const [key, { newValue }] of Object.entries(changes)) {
            const oldValue = cache[key];
            cache[key] = newValue;

            const keyListeners = listeners.get(key);
            if (keyListeners) {
                const intKey = parseInt(key) as ConfigKey;
                const decompressedOldValue =
                    oldValue !== undefined
                        ? decompressObject(CONFIG_VALUE_TYPE_DEF[intKey], oldValue)
                        : CONFIG_DEFAULT_VALUES[intKey];
                const decompressedNewValue =
                    newValue !== undefined
                        ? decompressObject(CONFIG_VALUE_TYPE_DEF[intKey], newValue)
                        : CONFIG_DEFAULT_VALUES[intKey];
                if (equal(decompressedOldValue, decompressedNewValue)) continue;
                for (const listener of keyListeners) {
                    listener(decompressedNewValue);
                }
            }
        }
    });
}

/**
 * 指定したキーのconfigを取得する。
 *
 * @param key - 取得するconfigのキー
 * @returns configの値
 */
export function getConfig<K extends ConfigKey>(key: K): ConfigValue<K> {
    if (!cache) throw Error("config is not initialized");
    return (
        cache[key] === undefined ? CONFIG_DEFAULT_VALUES[key] : decompressObject(CONFIG_VALUE_TYPE_DEF[key], cache[key])
    ) as ConfigValue<K>;
}

/**
 * 指定したキーのconfigを設定する。値はJSON.stringifyしたときに文字数が少なくなるように圧縮されて保存される。
 *
 * @param key - 設定するconfigのキー
 * @param value - 設定する値
 * @returns 値の設定が完了したときにresolveされるPromise
 */
export async function setConfig<K extends ConfigKey>(key: K, value: ConfigValue<K>): Promise<void> {
    if (!cache) throw Error("config is not initialized");

    const keyListeners = listeners.get(key.toString());
    if (keyListeners) {
        const decompressedOldValue =
            cache[key] === undefined
                ? CONFIG_DEFAULT_VALUES[key]
                : decompressObject(CONFIG_VALUE_TYPE_DEF[key], cache[key]);
        if (!equal(decompressedOldValue, value)) {
            for (const listener of keyListeners) {
                listener(value);
            }
        }
    }

    if (equal(value, CONFIG_DEFAULT_VALUES[key])) {
        delete cache[key];
        await browser.storage.sync.remove(key.toString());
    } else {
        const compressed = compressObject(CONFIG_VALUE_TYPE_DEF[key], value as any);
        cache[key] = compressed;
        await browser.storage.sync.set({ [key.toString()]: compressed });
    }

    // バックグラウンドスクリプト以外からconfigが変更された場合、変更を適用するためにバックグラウンドスクリプトを起こす
    if (getCurrentExtensionContext() !== "background") {
        await call("ping");
    }
}

/**
 * 指定したキーのconfigが変更された時に呼び出されるリスナーを登録する。
 *
 * @param key - リスナーを登録するconfigのキー
 * @param listener - 登録するリスナー
 * @param initialCall - trueの場合、現在のconfigの値を使用してすぐにlistenerを呼び出す
 */
export function addOnConfigChangeListener<K extends ConfigKey>(
    key: K,
    listener: (newValue: ConfigValue<K>) => void,
    initialCall = true
): void {
    if (!cache) throw Error("config is not initialized");

    const strKey = key.toString();

    const list = listeners.get(strKey) ?? [];
    list.push(listener);
    listeners.set(strKey, list);

    if (initialCall) {
        listener(getConfig(key));
    }
}

/**
 * 指定したキーのconfigが変更された時に呼び出されるリスナーを削除する。
 *
 * @param key - リスナーを削除するconfigのキー
 * @param listener - 削除するリスナー
 */
export function removeOnConfigChangeListener<K extends ConfigKey>(
    key: K,
    listener: (newValue: ConfigValue<K>) => void
): void {
    const strKey = key.toString();

    const list = listeners.get(strKey);
    if (list) {
        const index = list.findIndex((l) => l === listener);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }
}

/**
 * configの保存に使用されているストレージの使用量を取得する。
 *
 * @returns 使用量と最大容量（バイト）
 */
export async function getStorageUsage(): Promise<{ used: number; max: number }> {
    return {
        used: await browser.storage.sync.getBytesInUse(),
        max: 102400 /*chrome.storage.sync.QUOTA_BYTES*/,
    };
}

/**
 * 指定したキーのconfigの保存に使用されているストレージの使用量を取得する。
 *
 * @param key - 取得するconfigのキー
 * @returns 使用量と最大容量（バイト）
 */
export async function getStorageUsageByKey(key: ConfigKey): Promise<{ used: number; max: number }> {
    return {
        used: await browser.storage.sync.getBytesInUse(key.toString()),
        max: 8192 /*chrome.storage.sync.QUOTA_BYTES_PER_ITEM*/,
    };
}
