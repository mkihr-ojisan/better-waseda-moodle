import { addOnConfigChangeListener, ConfigKey } from "../config/config";
import { assertExtensionContext } from "../util/context";

assertExtensionContext("background");

/** ログインしていない状態でMoodleのページを開こうとした時に自動ログインする機能を初期化する。 */
export function initAutoLogin(): void {
    // リダイレクト先がログインページの場合、自動ログインページにリダイレクトする。
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
}

/**
 * リダイレクト先がログインページの場合、自動ログインページにリダイレクトする。
 *
 * @param details - リクエストの詳細
 * @returns レスポンスの変更
 */
function webRequestListener(
    details: browser.webRequest._OnHeadersReceivedDetails
): browser.webRequest.BlockingResponse | undefined {
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
}
