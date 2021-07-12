import React from 'react';
import ReactDOM from 'react-dom';
import { getConfig } from '../../common/config/config';
import { getQuestions, Question } from './questions';
import RemindDialog from './RemindDialog';

function isSequentialQuiz() {
    return document.getElementsByClassName('qnbutton')[0].classList.contains('sequential');
}

(async () => {
    if (!isSequentialQuiz() && (await getConfig('quiz.remindUnansweredQuestions.sequentialQuizOnly'))) return;

    const reactRoot = document.createElement('div');
    document.body.appendChild(reactRoot);

    const submitButton = document.getElementsByClassName('mod_quiz-next-nav')[0] as HTMLInputElement | undefined;

    let allowSubmit = false;
    let unansweredQuestions: Question[] = [];
    submitButton?.addEventListener(
        'click',
        (e) => {
            if (allowSubmit) return true;

            unansweredQuestions = getQuestions().filter((q) => !q.isAnswered);

            if (unansweredQuestions.length > 0) {
                ReactDOM.render(
                    <RemindDialog
                        open={true}
                        onClose={onClose}
                        unansweredQuestions={unansweredQuestions}
                        onContinue={continueSubmit}
                    />,
                    reactRoot
                );

                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        },
        true
    );

    function onClose() {
        ReactDOM.render(
            <RemindDialog
                open={false}
                onClose={onClose}
                unansweredQuestions={unansweredQuestions}
                onContinue={continueSubmit}
            />,
            reactRoot
        );
    }

    function continueSubmit() {
        allowSubmit = true;
        submitButton?.click();
    }
})();
