import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";

/**
 * ファイルを保存せずにブラウザで表示する機能を初期化する
 */
export function initViewInBrowser(): void {
    addOnConfigChangeListener(
        ConfigKey.ViewInBrowserEnabled,
        (enabled) => {
            // Content-Dispositionヘッダの"attachment"を削除することで、ブラウザで直接表示できるようにする
            if (enabled) {
                browser.webRequest.onHeadersReceived.addListener(listener, { urls: ["*://*/*"] }, [
                    "blocking",
                    "responseHeaders",
                ]);
            } else {
                browser.webRequest.onHeadersReceived.removeListener(listener);
            }
        },
        true
    );
}

const listener = (details: browser.webRequest._OnHeadersReceivedDetails) => {
    const headers = details.responseHeaders;
    if (!headers) return;

    const index = headers.findIndex((h) => h.name.toLowerCase() === "content-disposition");
    if (index !== -1) {
        headers[index].value = headers[index].value
            ?.split(";")
            ?.map((v) => (v.trim().toLowerCase() === "attachment" ? "inline" : v.trim()))
            ?.join("; ");

        return {
            responseHeaders: headers,
        };
    } else {
        return undefined;
    }
};
