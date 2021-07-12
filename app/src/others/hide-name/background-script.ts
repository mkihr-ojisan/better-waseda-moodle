import { onConfigChange } from '../../common/config/config';

let registeredContentScript: Promise<browser.contentScripts.RegisteredContentScript> | null = null;

export function initHideName(): void {
    onConfigChange(
        'hideName.enabled',
        (_, newValue) => {
            if (newValue) register();
            else unregister();
        },
        true
    );
}

async function register() {
    registeredContentScript = browser.contentScripts.register({
        matches: ['https://wsdmoodle.waseda.jp/*'],
        css: [{ file: 'src/others/hide-name/style.css' }],
        runAt: 'document_start',
    });
}
async function unregister() {
    (await registeredContentScript)?.unregister();
}
