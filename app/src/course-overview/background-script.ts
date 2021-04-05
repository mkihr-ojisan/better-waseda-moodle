import { onConfigChange } from '../common/config/config';

let registeredContentScript: browser.contentScripts.RegisteredContentScript | null = null;

export function initCourseOverview(): void {
    onConfigChange('courseOverview.enabled', (_, newValue) => {
        if (newValue)
            register();
        else
            unregister();
    }, true);
}

async function register() {
    registeredContentScript = await browser.contentScripts.register({
        matches: ['https://wsdmoodle.waseda.jp/my/*'],
        js: [{ file: 'src/course-overview/content-script.js' }],
        runAt: 'document_start',
    });
}
function unregister() {
    registeredContentScript?.unregister();
}