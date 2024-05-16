import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * スタイルを修正する機能を初期化する
 */
export function initFixStyle(): void {
    registerContentScript(ConfigKey.ReduceCourseContentPaddingEnabled, [
        {
            id: "reduce-course-content-padding",
            css: ["fix-style/reduce-course-content-padding.css"],
            matches: ["https://wsdmoodle.waseda.jp/course/view.php*"],
            runAt: "document_start",
        },
    ]);
    registerContentScript(ConfigKey.RemoveFloatingActionButtonsEnabled, [
        {
            id: "remove-floating-action-button",
            css: ["fix-style/remove-floating-action-button.css"],
            matches: ["https://wsdmoodle.waseda.jp/*"],
            runAt: "document_start",
        },
    ]);
    registerContentScript(ConfigKey.RemoveNotificationBadgeEnabled, [
        {
            id: "remove-notification-badge",
            css: ["fix-style/remove-notification-badge.css"],
            matches: ["https://wsdmoodle.waseda.jp/*"],
            runAt: "document_start",
        },
    ]);
}
