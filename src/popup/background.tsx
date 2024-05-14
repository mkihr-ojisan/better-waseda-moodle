import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";
import { initBadge } from "./badge";

/**
 * タイムラインの機能を初期化する
 */
export function initTimeline(): void {
    addOnConfigChangeListener(
        ConfigKey.TimelineEnabled,
        (enabled) => {
            if (enabled) {
                browser.action.enable();
            } else {
                browser.action.disable();
            }
        },
        true
    );

    initBadge();
}
