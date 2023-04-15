import { fetchUserProfile } from "../api/moodle/user-profile";
import { assertExtensionContext } from "../util/context";
import { all } from "deepmerge";

assertExtensionContext("background");

/** 学部・研究科を表す型 */
export type Faculty = {
    /** 学部・研究科を一意に識別する文字列 */
    readonly id: string;
    /** 学部・研究科の名前 */
    readonly name: {
        /** 学部・研究科の日本語名 */
        readonly ja: string;
        /** 学部・研究科の英語名 */
        readonly en: string;
    };
    /** 文字列から学部・研究科を判別するときに比較する文字列のリスト */
    readonly match?: readonly string[];
    /** 学部・研究科に関連付けられたConstants */
    readonly constants: readonly Constants[];
};

export type Constants = {
    /** 各時限の開始時刻と終了時刻 */
    readonly period?: readonly (Readonly<
        Record<
            number,
            {
                /** 開始時刻 ([時, 分]) */
                readonly start: readonly [number, number];
                /** 終了時刻 ([時, 分]) */
                readonly end: readonly [number, number];
            }
        >
    > & {
        /** このデータが有効な期間の開始日時 */
        readonly since?: number;
        /** このデータが有効な期間の終了日時 */
        readonly until?: number;
    })[];
    /** 各クォーターの開始日と終了日。キーは年度 */
    readonly quarter?: Readonly<
        Record<
            number,
            Readonly<
                Record<
                    "spring" | "summer" | "fall" | "winter",
                    {
                        /** 開始日 */
                        readonly start: number;
                        /** 終了日 */
                        readonly end: number;
                    }
                >
            >
        >
    >;
    /** 授業のある国民の祝日と、国民の祝日以外の休日のリスト。キーは年度 */
    readonly holiday?: Readonly<
        Record<
            number,
            readonly {
                /** 日付 */
                readonly date: number;
                /** 休日の名前。国民の祝日の場合は省略可能 */
                readonly name?: string;
                /** その日に授業があるかどうか */
                readonly classes: boolean;
            }[]
        >
    >;
    /** 長期休暇の開始日と終了日。キーは年度 */
    readonly vacation?: Readonly<
        Record<
            number,
            Readonly<
                Record<
                    "summer" | "winter" | "spring",
                    {
                        /** 開始日 */
                        readonly start: number;
                        /** 終了日 */
                        readonly end: number;
                    }
                >
            >
        >
    >;
};

/**
 * 学部・研究科の一覧を取得する。
 *
 * @returns 学部・研究科の一覧
 */
export function getFaculties(): readonly Faculty[] {
    return FACULTIES;
}

/**
 * ログインしているユーザーの所属を取得し、その学部・研究科のConstantsを取得する。
 *
 * @returns 定数
 */
export async function getConstants(): Promise<Constants> {
    const userProfile = await fetchUserProfile.promise();

    const constants = [
        ...(
            FACULTIES.find(
                (f) => userProfile.japaneseAffiliation && f.match?.includes(userProfile.japaneseAffiliation)
            ) ?? FACULTIES.find((f) => f.id === "other")!
        ).constants,
    ];
    return all(constants);
}

const CONSTANTS_COMMON = {
    period: [
        {
            since: 1680274800000,
            "1": {
                start: [8, 50],
                end: [10, 30],
            },
            "2": {
                start: [10, 40],
                end: [12, 20],
            },
            "3": {
                start: [13, 10],
                end: [14, 50],
            },
            "4": {
                start: [15, 5],
                end: [16, 45],
            },
            "5": {
                start: [17, 0],
                end: [18, 40],
            },
            "6": {
                start: [18, 55],
                end: [20, 35],
            },
            "7": {
                start: [20, 45],
                end: [21, 35],
            },
        },
        {
            until: 1680274800000,
            "1": {
                start: [9, 0],
                end: [10, 30],
            },
            "2": {
                start: [10, 40],
                end: [12, 10],
            },
            "3": {
                start: [13, 0],
                end: [14, 30],
            },
            "4": {
                start: [14, 45],
                end: [16, 15],
            },
            "5": {
                start: [16, 30],
                end: [18, 0],
            },
            "6": {
                start: [18, 15],
                end: [19, 45],
            },
            "7": {
                start: [19, 55],
                end: [21, 25],
            },
        },
    ],
} as Constants;

const CONSTANTS_FSCI = {
    quarter: {
        "2023": {
            spring: {
                start: 1681225200000,
                end: 1685804400000,
            },
            summer: {
                start: 1685804400000,
                end: 1690210800000,
            },
            fall: {
                start: 1696431600000,
                end: 1700924400000,
            },
            winter: {
                start: 1700924400000,
                end: 1706367600000,
            },
        },
    },
    holiday: {
        "2023": [
            {
                date: 1696777200000,
                classes: true,
            },
            {
                date: 1697814000000,
                name: "創立記念日",
                classes: true,
            },
            {
                date: 1699023600000,
                name: "理工展",
                classes: false,
            },
            {
                date: 1699110000000,
                name: "理工展",
                classes: false,
            },
        ],
    },
    vacation: {
        "2023": {
            summer: {
                start: 1690815600000,
                end: 1695222000000,
            },
            winter: {
                start: 1703516400000,
                end: 1704553200000,
            },
            spring: {
                start: 1706972400000,
                end: 1711897200000,
            },
        },
    },
} as Constants;

const FACULTIES = [
    {
        id: "other",
        name: {
            ja: "その他",
            en: "Other",
        },
        constants: [CONSTANTS_COMMON],
    },
    {
        id: "fse",
        name: {
            ja: "基幹理工学部・研究科",
            en: "School of Fundamental Science and Engineering",
        },
        match: ["基幹理工学部", "基幹理工学研究科"],
        constants: [CONSTANTS_COMMON, CONSTANTS_FSCI],
    },
    {
        id: "cse",
        name: {
            ja: "創造理工学部・研究科",
            en: "School of Creative Science and Engineering",
        },
        match: ["創造理工学部", "創造理工学研究科"],
        constants: [CONSTANTS_COMMON, CONSTANTS_FSCI],
    },
    {
        id: "ase",
        name: {
            ja: "先進理工学部・研究科",
            en: "School of Advanced Science and Engineering",
        },
        match: ["先進理工学部", "先進理工学研究科"],
        constants: [CONSTANTS_COMMON, CONSTANTS_FSCI],
    },
] as readonly Faculty[];
