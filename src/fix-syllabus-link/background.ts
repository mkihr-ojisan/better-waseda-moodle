import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * シラバスのリンクを修正する機能を初期化する
 */
export function initFixSyllabusLink(): void {
    registerContentScript(ConfigKey.FixSyllabusLinkEnabled, {
        matches: [
            "https://www.wsl.waseda.jp/syllabus/JAA101.php*",
            "https://www.wsl.waseda.jp/syllabus/JAA102.php*",
            "https://www.wsl.waseda.jp/syllabus/index.php*",
        ],
        js: [{ file: "fix-syllabus-link/content.js" }],
        runAt: "document_idle",
    });
}
