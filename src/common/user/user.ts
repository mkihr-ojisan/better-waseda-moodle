import { core_webservice_get_site_info } from "../api/moodle/core_webservice";
import { getSchoolYear } from "../util/school-year";

/**
 * ユーザーの入学年度を取得する
 */
export async function fetchEnrollmentYear(): Promise<number> {
    const siteInfo = await core_webservice_get_site_info();
    const year = parseInt(siteInfo.username.slice(0, 4));
    if (isNaN(year)) {
        throw new Error("Failed to fetch enrollment year");
    }
    return year;
}

/**
 * ユーザーの入学年度を取得する。キャッシュがあればそれを返す
 */
export async function getEnrollmentYear(): Promise<number> {
    const cache = (await browser.storage.local.get("enrollment_year"))["enrollment_year"] as
        | { year: number; last_updated: number }
        | undefined;

    // 年度が変わった場合は再取得する
    if (cache !== undefined && getSchoolYear(cache.last_updated) === getSchoolYear(Date.now())) {
        return cache.year;
    }

    const year = await fetchEnrollmentYear();
    await browser.storage.local.set({ enrollment_year: { year, last_updated: Date.now() } });
    return year;
}
