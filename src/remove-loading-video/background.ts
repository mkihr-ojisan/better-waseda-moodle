import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";

/**
 * 動画のロード中に再生される動画を削除する機能を初期化する
 */
export function initRemoveLoadingVideo(): void {
    addOnConfigChangeListener(
        ConfigKey.RemoveLoadingVideoEnabled,
        (enabled) => {
            if (enabled) {
                browser.webRequest.onBeforeRequest.addListener(
                    redirectToEmptyVideo,
                    { urls: ["*://*.waseda.jp/settings/viewer/uniplayer/intro.mp4"], types: ["media"] },
                    ["blocking"]
                );
            } else {
                browser.webRequest.onBeforeRequest.removeListener(redirectToEmptyVideo);
            }
        },
        true
    );
}

const redirectToEmptyVideo = (): browser.webRequest.BlockingResponse => {
    return {
        redirectUrl: browser.runtime.getURL("/res/videos/dummy-video.mp4"),
    };
};
