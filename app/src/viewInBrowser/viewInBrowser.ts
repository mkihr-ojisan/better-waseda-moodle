import { onConfigChange } from '../config/config';
import { VIEW_IN_BROWSER_ENABLED } from '../config/configKeys';

export function initViewInBrowser(): void {
    onConfigChange(VIEW_IN_BROWSER_ENABLED, (_, newValue) => {
        if (newValue) {
            browser.webRequest.onHeadersReceived.addListener(
                listener,
                {
                    urls: [
                        '*://*/*'
                    ]
                },
                ['blocking', 'responseHeaders']
            );
        } else {
            browser.webRequest.onHeadersReceived.removeListener(listener);
        }
    }, true);
}

function listener(details: browser.webRequest._OnHeadersReceivedDetails) {
    const headers = details.responseHeaders;
    if (!headers) return;

    const index = headers.findIndex(h => h.name.toLowerCase() === 'content-disposition');
    if (index !== -1) {
        headers.splice(index, 1);
        return {
            responseHeaders: headers
        };
    } else {
        return undefined;
    }
}