import { getLoginInfo } from "@/common/auto-login/getLoginInfo";
import { initConfig } from "@/common/config/config";
import { InvalidResponseError } from "@/common/error";
import { fetchHTML, postFormAndParse } from "@/common/util/fetch";
import { postFormInWindow } from "../launcher";

/**
 * 科目登録ページを開く
 */
export async function launchCourseRegistration(): Promise<void> {
    let page = await fetchHTML("https://coursereg.waseda.jp/portal/simpleportal.php?HID_P14=JA");

    if (page.getElementsByTagName("script")[0]?.textContent?.startsWith("//<![CDATA[\n$Config={")) {
        const strParams = page.getElementsByTagName("script")[0]?.textContent?.slice(20, -7);
        if (!strParams) throw new InvalidResponseError("cannot find `$Config`");
        const params = JSON.parse(strParams);

        await initConfig();
        const { userId, password } = getLoginInfo();

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
        "https://coursereg.waseda.jp/Shibboleth.sso/SAML2/POST"
    ) {
        const form = Object.fromEntries(
            (
                Array.from(page.getElementsByTagName("input")).filter(
                    (e) => e.getAttribute("type") === "hidden"
                ) as HTMLInputElement[]
            ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
        );
        page = await postFormAndParse("https://coursereg.waseda.jp/Shibboleth.sso/SAML2/POST", form);
    }

    if (!page.querySelector('form[name="F01"]')) {
        throw new InvalidResponseError("Cannot find form");
    }

    const form = Object.fromEntries(
        (Array.from(page.querySelectorAll('form[name="F01"] input[type="hidden"]')) as HTMLInputElement[]).map((e) => [
            e.getAttribute("name"),
            e.getAttribute("value"),
        ])
    );
    form["url"] = "https://wcrs.waseda.jp/kyomu/epb1110.htm";
    form["HID_P6"] = "eStudent";
    form["HID_P8"] = "ea02";
    form["pageflag"] = "1000";
    form["status"] = "0";

    postFormInWindow(form, "https://coursereg.waseda.jp/portal/simpleportal.php");
}
