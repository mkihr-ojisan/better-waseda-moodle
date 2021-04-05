import { onConfigChange } from '../../common/config/config';

let registeredContentScript: browser.contentScripts.RegisteredContentScript | null = null;

export function initHideName(): void {
    onConfigChange('hideName.enabled', (_, newValue) => {
        if (newValue)
            register();
        else
            unregister();
    }, true);
}

async function register() {
    registeredContentScript = await browser.contentScripts.register({
        matches: ['https://wsdmoodle.waseda.jp/*'],
        css: [{ file: 'src/others/hide-name/style.css' }],
        runAt: 'document_start',
    });
}
function unregister() {
    registeredContentScript?.unregister();
}