import { onConfigChange } from '../../common/config/config';
import { HIDE_NAME_ENABLED } from '../../common/config/config-keys';

let registeredContentScript: browser.contentScripts.RegisteredContentScript | null = null;

export function initHideName(): void {
    onConfigChange(HIDE_NAME_ENABLED, (_, newValue) => {
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