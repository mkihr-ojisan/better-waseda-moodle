import { onConfigChange } from '../../common/config/config';

let registeredContentScript: Promise<browser.contentScripts.RegisteredContentScript> | null = null;

export function initRemindUnansweredQuestions(): void {
    onConfigChange('quiz.remindUnansweredQuestions.enabled', (_, newValue) => {
        if (newValue)
            register();
        else
            unregister();
    }, true);
}

async function register() {
    registeredContentScript = browser.contentScripts.register({
        matches: ['https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*'],
        js: [{ file: 'src/quiz/remind-unanswered-questions/content-script.js' }],
        runAt: 'document_idle',
    });
}
async function unregister() {
    (await registeredContentScript)?.unregister();
}