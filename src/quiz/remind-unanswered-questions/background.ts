import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * 小テストで解答していない問題がある場合に確認する機能を初期化する
 */
export function initRemindUnansweredQuestions(): void {
    registerContentScript(ConfigKey.RemindUnansweredQuestionsEnabled, {
        matches: ["https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*"],
        js: [{ file: "quiz/remind-unanswered-questions/content.js" }],
        runAt: "document_idle",
    });
}
