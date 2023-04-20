import { Lazy } from "@/common/util/lazy";
import { InvalidResponseError, LoginError } from "../../error";
import { combinePromise } from "../../util/combine-promise";
import { assertExtensionContext } from "../../util/context";
import { fetchHTML, fetchWithCredentials, postForm, postFormAndParse } from "../../util/fetch";

assertExtensionContext("background");

export type LoginOptions = {
    /** 最初に https://wsdmoodle.waseda.jp/ にアクセスしてログインを確認するかどうか。既にログインしている場合は速くなるが、ログインが必要な場合は遅くなる。 */
    skipCheck?: boolean;
    /** セッションキーの取得をスキップするかどうか */
    skipSessionKey?: boolean;
};

/**
 * 指定したユーザIDとパスワードを使用して、Waseda Moodleにログインする。
 *
 * @param loginInfo - ログイン情報を取得する関数。この関数はログインが必要なときにのみ呼び出される。
 * @returns セッションキー。`skipSessionKey`が`true`の場合は`undefined`。
 * @throws LoginError ログインに失敗した場合
 */
export const login = combinePromise(
    async (loginInfo: Lazy<{ userId: string; password: string }>, options?: LoginOptions) => {
        try {
            let needLogin;
            let response: Response | null = null;
            if (options?.skipCheck) {
                needLogin = true;
            } else {
                response = await fetchWithCredentials("https://wsdmoodle.waseda.jp/user/preferences.php");
                needLogin = response.url === "https://wsdmoodle.waseda.jp/login/index.php";
            }
            if (needLogin) {
                let page2 = await fetchHTML(
                    "https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off"
                );

                if (page2.getElementsByTagName("script")[0]?.textContent?.startsWith("//<![CDATA[\n$Config={")) {
                    const strParams = page2.getElementsByTagName("script")[0]?.textContent?.slice(20, -7);
                    if (!strParams) throw new InvalidResponseError("cannot find `$Config`");
                    const params = JSON.parse(strParams);

                    const { userId, password } = loginInfo.get();

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
                    page2 = await postFormAndParse(
                        "https://login.microsoftonline.com/b3865172-9887-4b3a-89ff-95a35b92f4c3/login",
                        form
                    );
                }

                if (
                    page2.getElementsByTagName("form")[0]?.getAttribute?.("action") ===
                    "https://iaidp.ia.waseda.jp/idp/profile/Authn/SAML2/POST/SSO"
                ) {
                    const form = Object.fromEntries(
                        (
                            Array.from(page2.getElementsByTagName("input")).filter(
                                (e) => e.getAttribute("type") === "hidden"
                            ) as HTMLInputElement[]
                        ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
                    );
                    page2 = await postFormAndParse("https://iaidp.ia.waseda.jp/idp/profile/Authn/SAML2/POST/SSO", form);
                }

                if (
                    page2.getElementsByTagName("form")[0]?.getAttribute?.("action") ===
                    "https://wsdmoodle.waseda.jp/auth/saml2/sp/saml2-acs.php/wsdmoodle.waseda.jp"
                ) {
                    const form = Object.fromEntries(
                        (
                            Array.from(page2.getElementsByTagName("input")).filter(
                                (e) => e.getAttribute("type") === "hidden"
                            ) as HTMLInputElement[]
                        ).map((e) => [e.getAttribute("name"), e.getAttribute("value")])
                    );

                    await postForm(
                        "https://wsdmoodle.waseda.jp/auth/saml2/sp/saml2-acs.php/wsdmoodle.waseda.jp",
                        form,
                        { redirect: "manual" }
                    );
                    await fetchWithCredentials(
                        "https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off",
                        { redirect: "manual" }
                    );
                }
            }

            if (!options?.skipSessionKey) {
                if (!response || response.url === "https://wsdmoodle.waseda.jp/login/index.php") {
                    response = await fetchWithCredentials("https://wsdmoodle.waseda.jp/user/preferences.php");
                }
                const page = await response.text();

                const sessionKey = page.match(
                    /"https:\/\/wsdmoodle\.waseda\.jp\/login\/logout\.php\?sesskey=([^"]+)"/
                )?.[1];
                if (!sessionKey) throw new InvalidResponseError("cannot find sessionKey");

                return sessionKey;
            }
        } catch (error) {
            throw new LoginError(error);
        }
    }
);
