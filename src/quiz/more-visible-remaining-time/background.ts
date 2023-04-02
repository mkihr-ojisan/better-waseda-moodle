import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * 小テストの残り時間を見やすくする機能を初期化する
 */
export function initMoreVisibleRemainingTime(): void {
    registerContentScript(ConfigKey.MoreVisibleRemainingTimeEnabled, {
        css: [{ file: "quiz/more-visible-remaining-time/style.css" }],
        matches: ["https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*"],
    });
}
