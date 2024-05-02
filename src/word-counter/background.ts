import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * 文字数カウント機能を初期化する
 */
export function initWordCounter(): void {
    registerContentScript(ConfigKey.WordCounterEnabled, {
        matches: ["https://wsdmoodle.waseda.jp/*"],
        js: [{ file: "word-counter/content.js" }],
        runAt: "document_end",
    });
}
