import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * スタイルを修正する機能を初期化する
 */
export function initFixStyle(): void {
    registerContentScript(ConfigKey.ReduceCourseContentPaddingEnabled, {
        css: [{ file: "fix-style/reduce-course-content-padding.css" }],
        matches: ["https://wsdmoodle.waseda.jp/course/view.php*"],
        runAt: "document_start",
    });
    registerContentScript(ConfigKey.RemoveFloatingActionButtonsEnabled, {
        css: [{ file: "fix-style/remove-floating-action-button.css" }],
        matches: ["https://wsdmoodle.waseda.jp/*"],
        runAt: "document_start",
    });
    registerContentScript(ConfigKey.RemoveNotificationBadgeEnabled, {
        css: [{ file: "fix-style/remove-notification-badge.css" }],
        matches: ["https://wsdmoodle.waseda.jp/*"],
        runAt: "document_start",
    });
}
