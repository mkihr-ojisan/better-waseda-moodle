import { onConfigChange } from '../../common/config/config';
import { DISABLE_RATE_LIMIT_ENABLED } from '../../common/config/config-keys';

export function initDisableRateLimit(): void {
    onConfigChange(DISABLE_RATE_LIMIT_ENABLED, (_, newValue) => {
        if (newValue) {
            browser.webRequest.onBeforeRequest.addListener(
                listener,
                {
                    urls: [
                        'https://coursereg.waseda.jp/portal/common/fncControlSubmit.js',
                    ],
                },
                ['blocking'],
            );
        } else {
            browser.webRequest.onBeforeRequest.removeListener(listener);
        }
    }, true);
}

function listener(): browser.webRequest.BlockingResponse {
    return {
        redirectUrl: 'data:text/javascript,function fncControlSubmit() { return true; }',
    };
}