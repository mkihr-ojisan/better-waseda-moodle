import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";
import { assertExtensionContext } from "@/common/util/context";

assertExtensionContext("background");

/**
 *ダッシュボードから発行されるリクエストをブロックしてサーバー負荷を軽減する機能を初期化する
 */
export function initBlockXhrRequests(): void {
    registerContentScript(
        [ConfigKey.CourseOverviewEnabled],
        [
            {
                id: "block-xhr-requests",
                matches: ["https://wsdmoodle.waseda.jp/my/"],
                js: ["block-xhr-requests/content.js"],
                runAt: "document_start",
            },
        ]
    );
}
