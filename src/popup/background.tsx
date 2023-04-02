import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";

/**
 * タイムラインの機能を初期化する
 */
export function initTimeline(): void {
    addOnConfigChangeListener(
        ConfigKey.TimelineEnabled,
        (enabled) => {
            if (enabled) {
                browser.browserAction.enable();
            } else {
                browser.browserAction.disable();
            }
        },
        true
    );
}
