import { onConfigChange } from '../../common/config/config';

let registeredContentScript: Promise<browser.contentScripts.RegisteredContentScript> | null = null;

export function initMoreVisibleRemainingTime(): void {
    onConfigChange('moreVisibleRemainingTime.enabled', (_, newValue) => {
        if (newValue)
            register();
        else
            unregister();
    }, true);
}

async function register() {
    registeredContentScript = browser.contentScripts.register({
        matches: ['https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*'],
        css: [{ file: 'src/quiz/more-visible-remaining-time/style.css' }],
    });
}
async function unregister() {
    (await registeredContentScript)?.unregister();
}