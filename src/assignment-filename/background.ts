import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * 課題のファイル名を設定する機能を初期化する
 */
export function initAssignmentFilename(): void {
    registerContentScript(ConfigKey.AssignmentFilenameEnabled, {
        js: [{ file: "assignment-filename/content.js" }],
        runAt: "document_start",
        matches: ["https://wsdmoodle.waseda.jp/mod/assign/view.php?*"],
    });
}
