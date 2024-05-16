import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";

/**
 * ファイルを保存せずにブラウザで表示する機能を初期化する
 */
export function initViewInBrowser(): void {
    if (process.env.VENDOR === "firefox") {
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
    } else {
        // Content-Dispositionヘッダを全部inlineに書き換える
        // ファイル名の情報が消えるんじゃないかと思うけどよくわからん
        registerNetRequestRules(ConfigKey.ViewInBrowserEnabled, [
            {
                condition: {
                    urlFilter: "|https://wsdmoodle.waseda.jp/*",
                    resourceTypes: ["main_frame"],
                },
                action: {
                    type: "modifyHeaders",
                    responseHeaders: [
                        {
                            header: "Content-Disposition",
                            operation: "set",
                            value: "inline",
                        },
                    ],
                },
            },
        ]);
    }
}
