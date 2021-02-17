import { onConfigChange } from '../../config/config';
import { MORE_VISIBLE_REMAINING_TIME_ENABLED } from '../../config/configKeys';

let registeredContentScript: browser.contentScripts.RegisteredContentScript | null = null;

export function initMoreVisibleRemainingTime(): void {
    onConfigChange(MORE_VISIBLE_REMAINING_TIME_ENABLED, (_, newValue) => {
        if (newValue)
            register();
        else
            unregister();
    }, true);
}

async function register() {
    registeredContentScript = await browser.contentScripts.register({
        matches: ['https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*'],
        css: [{ file: 'src/quiz/moreVisibleRemainingTime/style.css' }]
    });
}
function unregister() {
    registeredContentScript?.unregister();
}