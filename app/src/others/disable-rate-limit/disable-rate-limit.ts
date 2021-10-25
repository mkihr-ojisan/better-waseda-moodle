import { onConfigChange } from '../../common/config/config';

export function initDisableRateLimit(): void {
    onConfigChange(
        'disableRateLimit.enabled',
        (_, newValue) => {
            if (newValue) {
                browser.webRequest.onBeforeRequest.addListener(
                    listener,
                    {
                        urls: ['https://coursereg.waseda.jp/portal/common/fncControlSubmit.js'],
                    },
                    ['blocking']
                );
            } else {
                browser.webRequest.onBeforeRequest.removeListener(listener);
            }
        },
        true
    );
}

function listener(): browser.webRequest.BlockingResponse {
    return {
        redirectUrl: 'data:text/javascript,function fncControlSubmit() { return true; }',
    };
}
