import { ConfigKey, getConfig } from "@/common/config/config";
import { InvalidResponseError, LoginRequiredError } from "@/common/error";
import { fetchWithCredentials, postFormAndParse } from "@/common/util/fetch";
import { postFormWithEncodingAndParse } from "@/common/util/fetchWithEncoding";
import { sleep } from "@/common/util/sleep";

export type PersonalInformation = {
    studentId: string;
    name: string;
    faculty: string;
};

/**
 * MyWasedaの「学生基本情報変更」から、学籍番号、氏名、学部を取得する。
 * 💩ードにも程がある
 */
export async function fetchPersonalInformation(): Promise<PersonalInformation> {
    const response = await fetchWithCredentials(
        "https://my.waseda.jp/portal/view/portal-top-view?communityId=1&communityPageId=8&popUpMenuId=1112&popUpFlg=1&openWindow=2&subsessionWindowId="
    );

    let windowId: string | undefined;

    let page = new DOMParser().parseFromString(await response.text(), "text/html");
    // ログインが必要
    if (page.getElementsByTagName("script")[0]?.textContent?.startsWith("//<![CDATA[\n$Config={")) {
        const strParams = page.getElementsByTagName("script")[0]?.textContent?.slice(20, -7);
        if (!strParams) throw new InvalidResponseError("cannot find `$Config`");
        const params = JSON.parse(strParams);

        const { userId, password } = getConfig(ConfigKey.LoginInfo);
        if (userId === "" || password === "") throw new LoginRequiredError();

        const form: Record<string, string> = {
            i13: "0",
            login: userId,
            loginfmt: userId,
            type: "11",
            LoginOptions: "3",
            lrt: "",
            lrtPartition: "",
            hisRegion: "",
            hisScaleUnit: "",
            passwd: password,
            ps: "2",
            psRNGCDefaultType: "",
            psRNGCEntropy: "",
            psRNGCSLK: "",
            canary: params.canary,
            ctx: params.sCtx,
            hpgrequestid: params.sessionId,
            flowToken: params.sFT,
            PPSX: "",
            NewUser: "1",
            FoundMSAs: "",
            fspost: "0",
            i21: "0",
            CookieDisclosure: "0",
            IsFidoSupported: "0",
            isSignupPost: "0",
            isRecoveryAttemptPost: "0",
            i19: "14162",
        };
        page = await postFormAndParse(
            "https://login.microsoftonline.com/b3865172-9887-4b3a-89ff-95a35b92f4c3/login",
            form
        );
    }

    if (
        page.getElementsByTagName("form")[0]?.getAttribute?.("action") ===
        "https://iaidp.ia.waseda.jp/idp/profile/Authn/SAML2/POST/SSO"
    ) {
        const form = Object.fromEntries(
            (
                Array.from(page.getElementsByTagName("input")).filter(
                    (e) => e.getAttribute("type") === "hidden"
                ) as HTMLInputElement[]
            ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
        );
        page = await postFormAndParse("https://iaidp.ia.waseda.jp/idp/profile/Authn/SAML2/POST/SSO", form);
    }

    if (
        page.getElementsByTagName("form")[0]?.getAttribute?.("action") ===
        "https://my.waseda.jp/Shibboleth.sso/SAML2/POST"
    ) {
        const form = Object.fromEntries(
            (
                Array.from(page.getElementsByTagName("input")).filter(
                    (e) => e.getAttribute("type") === "hidden"
                ) as HTMLInputElement[]
            ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
        );
        page = await postFormAndParse("https://my.waseda.jp/Shibboleth.sso/SAML2/POST", form);
    }

    if (
        page.getElementsByTagName("form")[0]?.getAttribute?.("action") ===
        "/portal/view/portal-top-view?communityId=1&communityPageId=8&popUpMenuId=1112&popUpFlg=1&openWindow=2"
    ) {
        const form = Object.fromEntries(
            (
                Array.from(page.getElementsByTagName("input")).filter(
                    (e) => e.getAttribute("type") === "hidden"
                ) as HTMLInputElement[]
            ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
        );
        form["subsessionWindowId"] = windowId ??= await fetchWindowId();
        page = await postFormAndParse(
            "https://my.waseda.jp/portal/view/portal-top-view?communityId=1&communityPageId=8&popUpMenuId=1112&popUpFlg=1&openWindow=2",
            form
        );
    }

    if (
        page.getElementsByTagName("form")[0]?.getAttribute?.("action") ===
        "/portal/view/portal-top-view?communityId=1&communityPageId=8&popUpMenuId=1112&popUpFlg=1&openWindow=2"
    ) {
        const form = Object.fromEntries(
            (
                Array.from(page.getElementsByTagName("input")).filter(
                    (e) => e.getAttribute("type") === "hidden"
                ) as HTMLInputElement[]
            ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
        );
        form["subsessionWindowId"] = windowId ??= await fetchWindowId();
        page = await postFormAndParse(
            "https://my.waseda.jp/portal/view/portal-top-view?communityId=1&communityPageId=8&popUpMenuId=1112&popUpFlg=1&openWindow=2",
            form
        );
    }

    page = await postFormAndParse(
        "https://my.waseda.jp/portal/view/template-submit?url=https://www.wnp2.waseda.jp/wisdom/gakusei/application/ab41.html&communityId=1&menuId=1112&menuType=1 &menuUrl=https://www.wnp2.waseda.jp/wisdom/gakusei/application/ab41.html&pageServiceMenuId=140037&type=3&locationId=&openWindow=2",
        {
            clientsidelog: "",
            logCommunityId: "",
            logCommunityPageId: "",
            subsessionWindowId: (windowId ??= await fetchWindowId()),
        }
    );
    if (
        page.getElementsByTagName("form")[0]?.getAttribute?.("action") !==
        "https://www.wnp2.waseda.jp/wisdom/gakusei/application/ab41.html"
    ) {
        throw new InvalidResponseError("invalid form");
    } else {
        const form = Object.fromEntries(
            (
                Array.from(page.getElementsByTagName("input")).filter(
                    (e) => e.getAttribute("type") === "hidden"
                ) as HTMLInputElement[]
            ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
        );
        form["logCommunityId"] = form["logCommunityPageId"] = "";

        browser.cookies.set({
            url: "https://my.waseda.jp/portal/view/template-submit",
            domain: ".waseda.jp",
            path: "/",
            name: "Admission_Key",
            value: form["Admission_Key"],
        });
        browser.cookies.set({
            url: "https://my.waseda.jp/portal/view/template-submit",
            domain: ".waseda.jp",
            path: "/",
            name: "Admission_Key2",
            value: form["Admission_Key2"],
        });

        for (;;) {
            page = await postFormWithEncodingAndParse(
                "https://www.wnp2.waseda.jp/wisdom/gakusei/application/ab41.html",
                form,
                undefined,
                "EUC-JP" // ←は？っていうお気持ち
            );

            if (page.getElementsByClassName("c-page-name")[0]?.textContent === "強制終了") {
                await sleep(1000);
                continue;
            }

            break;
        }
    }

    const table = page.getElementsByClassName("c-table-block01")[0];
    if (!table) throw new InvalidResponseError("cannot find table");

    const studentId = table.getElementsByClassName("c-tb-main")[0]?.textContent?.trim();
    const name = table.getElementsByClassName("c-tb-main")[2]?.textContent?.trim();
    const faculty = table.getElementsByClassName("c-tb-main")[6]?.textContent?.trim();

    if (!studentId || !name || !faculty) throw new InvalidResponseError("invalid table");

    return {
        studentId,
        name,
        faculty,
    };
}

/**
 * WindowIdなる謎の値を取得する
 */
async function fetchWindowId(): Promise<string> {
    return (await fetchWithCredentials("https://my.waseda.jp/dummy/dummy-subsession!getNewWindowId")).text();
}
