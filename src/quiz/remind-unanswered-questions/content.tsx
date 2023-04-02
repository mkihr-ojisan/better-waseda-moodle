import React from "react";
import { getQuestions, Question } from "./questions";
import { RemindDialog } from "./RemindDialog";
import { createRoot } from "react-dom/client";
import { ConfigKey, getConfig, initConfig } from "@/common/config/config";

/**
 * @returns 小テストが前のページに戻れないタイプかどうか
 */
function isSequentialQuiz() {
    return document.getElementsByClassName("qnbutton")[0].classList.contains("sequential");
}

(async () => {
    await initConfig();
    if (
        !getConfig(ConfigKey.RemindUnansweredQuestionsEnabled) ||
        (!isSequentialQuiz() && getConfig(ConfigKey.RemindUnansweredQuestionsOnlySequentialQuiz))
    ) {
        return;
    }

    const rootElem = document.createElement("div");
    document.body.appendChild(rootElem);

    const submitButton = document.getElementsByClassName("mod_quiz-next-nav")[0] as HTMLInputElement | undefined;

    let allowSubmit = false;
    let unansweredQuestions: Question[] = [];

    const root = createRoot(rootElem);

    submitButton?.addEventListener(
        "click",
        (e) => {
            if (allowSubmit) return true;

            unansweredQuestions = getQuestions().filter((q) => !q.isAnswered);

            if (unansweredQuestions.length > 0) {
                root.render(
                    <RemindDialog
                        open={true}
                        onClose={onClose}
                        unansweredQuestions={unansweredQuestions}
                        onContinue={continueSubmit}
                    />
                );

                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        },
        true
    );

    /**
     *
     */
    function onClose() {
        root.render(
            <RemindDialog
                open={false}
                onClose={onClose}
                unansweredQuestions={unansweredQuestions}
                onContinue={continueSubmit}
            />
        );
    }

    /**
     *
     */
    function continueSubmit() {
        allowSubmit = true;
        submitButton?.click();
    }
})();
