import { ensureLogin } from "@/common/auto-login/auto-login";
import { InvalidResponseError } from "@/common/error";
import { cached } from "@/common/util/cached";
import { fetchHTML } from "@/common/util/fetch";

/** ユーザープロファイルのページ(https://wsdmoodle.waseda.jp/user/profile.php)から取得されたユーザー情報 */
export type UserProfile = {
    /** 氏名 */
    japaneseName?: string;
    /** Name */
    englishName?: string;
    /** カナ氏名 */
    katakanaName?: string;
    /** 履修学年/Year */
    year?: string;
    /** 所属 */
    japaneseAffiliation?: string;
    /** 学科 */
    japaneseDepartment?: string;
    /** コース */
    course?: string;
    /** Affiliation */
    englishAffiliation?: string;
    /** Department */
    englishDepartment?: string;
};

/**
 * ユーザープロファイルのページ(https://wsdmoodle.waseda.jp/user/profile.php)からユーザー情報を取得する
 */
export const fetchUserProfile = cached("userProfile", async () => {
    await ensureLogin();

    const doc = await fetchHTML("https://wsdmoodle.waseda.jp/user/profile.php");

    const ul = doc.getElementsByClassName("card-body")[0]?.getElementsByTagName("ul")?.[0];
    if (!ul) throw new InvalidResponseError("ul is not found");

    const userProfile: UserProfile = {};

    for (const li of Array.from(ul.getElementsByTagName("li"))) {
        const dt = li.getElementsByTagName("dt")[0];
        const dd = li.getElementsByTagName("dd")[0];
        if (!dt || !dd) continue;

        const value = dd.textContent?.trim();

        switch (dt.textContent?.trim()) {
            case "氏名":
                userProfile.japaneseName = value;
                break;
            case "Name":
                userProfile.englishName = value;
                break;
            case "カナ氏名":
                userProfile.katakanaName = value;
                break;
            case "履修学年/Year":
                userProfile.year = value;
                break;
            case "所属":
                userProfile.japaneseAffiliation = value;
                break;
            case "学科":
                userProfile.japaneseDepartment = value;
                break;
            case "コース":
                userProfile.course = value;
                break;
            case "Affiliation":
                userProfile.englishAffiliation = value;
                break;
            case "Department":
                userProfile.englishDepartment = value;
                break;
        }
    }

    return userProfile;
});
