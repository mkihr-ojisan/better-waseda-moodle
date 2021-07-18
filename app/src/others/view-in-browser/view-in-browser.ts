import { onConfigChange } from '../../common/config/config';

export function initViewInBrowser(): void {
    onConfigChange(
        'viewInBrowser.enabled',
        (_, newValue) => {
            if (newValue) {
                browser.webRequest.onHeadersReceived.addListener(
                    listener,
                    {
                        urls: ['*://*/*'],
                    },
                    ['blocking', 'responseHeaders']
                );
            } else {
                browser.webRequest.onHeadersReceived.removeListener(listener);
            }
        },
        true
    );
}

function listener(details: browser.webRequest._OnHeadersReceivedDetails) {
    const headers = details.responseHeaders;
    if (!headers) return;

    const index = headers.findIndex((h) => h.name.toLowerCase() === 'content-disposition');
    if (index !== -1) {
        headers[index].value = headers[index].value?.replace(/^([^;]*)attachment/i, '$1inline');
        return {
            responseHeaders: headers,
        };
    } else {
        return undefined;
    }
}
