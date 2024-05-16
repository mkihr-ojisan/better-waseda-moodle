import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * 課題提出時の注意事項にチェックを入れる機能を初期化する
 */
export function initCheckNotesOnSubmitting(): void {
    registerContentScript(ConfigKey.CheckNotesOnSubmittingEnabled, [
        {
            id: "check-notes-on-submitting",
            js: ["check-notes-on-submitting/content.js"],
            matches: ["https://wsdmoodle.waseda.jp/mod/assign/view.php?*"],
        },
    ]);
}
