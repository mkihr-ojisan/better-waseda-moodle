import { addOnConfigChangeListener, ConfigKey } from "../config/config";
import { assertExtensionContext } from "../util/context";

assertExtensionContext("background");

/** ログインしていない状態でMoodleのページを開こうとした時に自動ログインする機能を初期化する。 */
let initAutoLogin: () => void;

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

    initAutoLogin = (): void => {
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
    };
} else {
    // ChromeではonHeadersReceivedイベントでredirectUrlを設定できないため、
    // onHeaderReceivedListenerでリダイレクト先を記録し、その後発生するonBeforeRequestイベントでリダイレクトする。

    const redirectUrl = new Map<string, string>();

    const onHeaderReceivedListener = (
        details: browser.webRequest._OnHeadersReceivedDetails
    ): browser.webRequest.BlockingResponse | undefined => {
        if (details.type === "main_frame" && (details.statusCode === 302 || details.statusCode === 303)) {
            for (const header of details.responseHeaders ?? []) {
                if (
                    header.name.toLowerCase() === "location" &&
                    header.value?.startsWith("https://wsdmoodle.waseda.jp/login/index.php")
                ) {
                    redirectUrl.set(details.requestId, details.url);
                }
            }
        }
        return undefined;
    };

    const onBeforeRequestListener = (
        details: browser.webRequest._OnBeforeRequestDetails
    ): browser.webRequest.BlockingResponse | undefined => {
        if (redirectUrl.has(details.requestId)) {
            const url = redirectUrl.get(details.requestId)!;
            redirectUrl.delete(details.requestId);
            return {
                redirectUrl: browser.runtime.getURL(
                    `/common/auto-login/auto-login-page.html?redirectUrl=${encodeURIComponent(url)}`
                ),
            };
        }
        return undefined;
    };

    initAutoLogin = (): void => {
        addOnConfigChangeListener(ConfigKey.AutoLoginEnabled, (enabled) => {
            if (enabled) {
                browser.webRequest.onHeadersReceived.addListener(
                    onHeaderReceivedListener,
                    { urls: ["https://wsdmoodle.waseda.jp/*"], types: ["main_frame"] },
                    ["responseHeaders"]
                );
                browser.webRequest.onBeforeRequest.addListener(
                    onBeforeRequestListener,
                    { urls: ["https://wsdmoodle.waseda.jp/login/index.php"], types: ["main_frame"] },
                    ["blocking"]
                );
            } else {
                browser.webRequest.onHeadersReceived.removeListener(onHeaderReceivedListener);
            }
        });
    };
}

export { initAutoLogin };
