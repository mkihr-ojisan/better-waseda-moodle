import { ConfigKey } from "@/common/config/config";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";

/**
 * 動画のロード中に再生される動画を削除する機能を初期化する
 */
export function initRemoveLoadingVideo(): void {
    registerNetRequestRules(ConfigKey.RemoveLoadingVideoEnabled, "remove-loading-video");
}
