import { onConfigChange } from '../common/config/config';

let registeredContentScript: Promise<browser.contentScripts.RegisteredContentScript> | null = null;

export function initCourseOverview(): void {
    onConfigChange('courseOverview.enabled', (_, newValue) => {
        if (newValue)
            register();
        else
            unregister();
    }, true);
}

async function register() {
    registeredContentScript = browser.contentScripts.register({
        matches: ['https://wsdmoodle.waseda.jp/my/*'],
        js: [{ file: 'src/course-overview/content-script.js' }],
        runAt: 'document_start',
    });
}
async function unregister() {
    (await registeredContentScript)?.unregister();
}