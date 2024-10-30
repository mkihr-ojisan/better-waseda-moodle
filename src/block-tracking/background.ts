import { ConfigKey } from "@/common/config/config";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";

/**
 * トラッキングをブロックする機能を初期化する
 */
export function initBlockTracking(): void {
    registerNetRequestRules(ConfigKey.BlockTracking, "block-tracking");
}
