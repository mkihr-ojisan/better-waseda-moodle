import { addOnConfigChangeListener, ConfigKey } from "../config/config";
import { registerNetRequestRules } from "../config/declarativeNetRequest";
import { assertExtensionContext } from "../util/context";

assertExtensionContext("background");

/** ログインしていない状態でMoodleのページを開こうとした時に自動ログインする機能を初期化する。 */
export function initAutoLogin(): void {
    if (process.env.VENDOR === "firefox") {
        // リダイレクト先がログインページの場合、自動ログインページにリダイレクトする。

        const webRequestListener = (
            details: browser.webRequest._OnHeadersReceivedDetails
        ): browser.webRequest.BlockingResponse | undefined => {
            if (details.type === "main_frame" && (details.statusCode === 302 || details.statusCode === 303)) {
                for (const header of details.responseHeaders ?? []) {
                    if (
                        header.name.toLowerCase() === "location" &&
                        header.value?.startsWith("https://wsdmoodle.waseda.jp/login/index.php")
                    ) {
                        return {
                            redirectUrl: browser.runtime.getURL(
                                `/common/auto-login/auto-login-page.html?redirectUrl=${encodeURIComponent(details.url)}`
                            ),
                        };
                    }
                }
            }
            return undefined;
        };

        addOnConfigChangeListener(ConfigKey.AutoLoginEnabled, (enabled) => {
            if (enabled) {
                browser.webRequest.onHeadersReceived.addListener(
                    webRequestListener,
                    { urls: ["https://wsdmoodle.waseda.jp/*"], types: ["main_frame"] },
                    ["blocking", "responseHeaders"]
                );
            } else {
                browser.webRequest.onHeadersReceived.removeListener(webRequestListener);
            }
        });
    } else {
        // ログインページが開かれたとき、自動ログインページにリダイレクトする。
        registerNetRequestRules(ConfigKey.AutoLoginEnabled, [
            {
                condition: {
                    urlFilter: "https://wsdmoodle.waseda.jp/login/index.php",
                    resourceTypes: ["main_frame"],
                },
                action: {
                    type: "redirect",
                    redirect: {
                        extensionPath: "/common/auto-login/auto-login-page.html",
                    },
                },
            },
        ]);
    }
}
