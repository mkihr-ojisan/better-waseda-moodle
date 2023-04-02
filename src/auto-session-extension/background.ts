import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * 自動的にセッションを延長する機能を初期化する
 */
export function initAutoSessionExtension(): void {
    registerContentScript(ConfigKey.AutoSessionExtensionEnabled, {
        js: [{ file: "auto-session-extension/content.js" }],
        matches: ["https://wsdmoodle.waseda.jp/*"],
    });
}
