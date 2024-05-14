import { ConfigKey } from "@/common/config/config";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * unloadイベントを無効化する機能を初期化します。
 */
export function initDisableUnloadEvent(): void {
    registerContentScript(ConfigKey.FasterBackAndForward, [
        {
            id: "faster-back-and-forward",
            matches: ["https://wsdmoodle.waseda.jp/*"],
            js: ["/faster-back-and-forward/content.js"],
            runAt: "document_start",
        },
    ]);

    registerNetRequestRules(ConfigKey.FasterBackAndForward, [
        {
            condition: {
                urlFilter: "|https://wsdmoodle.waseda.jp/*",
                resourceTypes: ["main_frame"],
            },
            action: {
                type: "modifyHeaders",
                responseHeaders: [
                    {
                        header: "Cache-Control",
                        operation: "set",
                        value: "private, no-cache, max-age=0, must-revalidate",
                    },
                ],
            },
        },
    ]);
}
