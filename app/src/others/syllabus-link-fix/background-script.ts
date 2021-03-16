import { onConfigChange } from '../../common/config/config';
import { SYLLABUS_LINK_FIX_ENABLED } from '../../common/config/config-keys';

let registeredContentScript: browser.contentScripts.RegisteredContentScript | null = null;

export function initSyllabusLinkFix(): void {
    onConfigChange(SYLLABUS_LINK_FIX_ENABLED, (_, newValue) => {
        if (newValue)
            register();
        else
            unregister();
    }, true);
}

async function register() {
    registeredContentScript = await browser.contentScripts.register({
        matches: ['https://www.wsl.waseda.jp/syllabus/JAA101.php*'],
        js: [{ file: 'src/others/syllabus-link-fix/content-script.js' }],
        runAt: 'document_idle',
    });
}
function unregister() {
    registeredContentScript?.unregister();
}