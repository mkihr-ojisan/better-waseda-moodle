import { onConfigChange } from '../../common/config/config';

export function initRemoveLoadingVideo(): void {
    onConfigChange('removeLoadingVideo.enabled', (_, newValue) => {
        if (newValue) {
            browser.webRequest.onBeforeRequest.addListener(redirectToEmptyVideo, { urls: ['*://*.waseda.jp/settings/viewer/uniplayer/intro.mp4'] }, ['blocking']);
        } else {
            browser.webRequest.onBeforeRequest.removeListener(redirectToEmptyVideo);
        }
    }, true);
}

function redirectToEmptyVideo(): browser.webRequest.BlockingResponse {
    return {
        redirectUrl: browser.runtime.getURL('/res/videos/dummyVideo.mp4'),
    };
}