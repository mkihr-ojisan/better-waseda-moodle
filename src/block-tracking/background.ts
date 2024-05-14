import { ConfigKey } from "@/common/config/config";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";

/**
 * トラッキングをブロックする機能を初期化する
 */
export function initBlockTracking(): void {
    registerNetRequestRules(ConfigKey.BlockTracking, [
        {
            condition: {
                urlFilter: "|https://wsdmoodle.waseda.jp/lib/ajax/service.php?*local_intelldata_save_tracking",
            },
            action: {
                type: "block",
            },
        },
        {
            condition: {
                urlFilter: "|https://wsdmoodle.waseda.jp/local/intelliboard/ajax.php|",
            },
            action: {
                type: "block",
            },
        },
    ]);
}
