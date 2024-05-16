import { ConfigKey } from "@/common/config/config";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";

/**
 * 動画のロード中に再生される動画を削除する機能を初期化する
 */
export function initRemoveLoadingVideo(): void {
    registerNetRequestRules(ConfigKey.RemoveLoadingVideoEnabled, [
        {
            condition: {
                urlFilter: "*.waseda.jp/settings/viewer/uniplayer/intro.mp4|",
                resourceTypes: ["media"],
            },
            action: {
                type: "redirect",
                redirect: {
                    extensionPath: "/res/videos/dummy-video.mp4",
                },
            },
        },
    ]);
}
