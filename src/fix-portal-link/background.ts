import { ConfigKey } from "@/common/config/config";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * 成績照会・科目登録専用メニューのリンクを修正する機能を初期化する
 */
export function initFixPortalLink(): void {
    // fncControlSubmit.jsを置き換えることで、
    // 「ただいま処理中です。OKボタンを押して、しばらく待ってから再度メニューをクリックしてください。」
    // が出ないようにする。

    registerNetRequestRules(ConfigKey.FixPortalLinkEnabled, [
        {
            condition: {
                urlFilter: "|https://coursereg.waseda.jp/portal/common/fncControlSubmit.js|",
            },
            action: {
                type: "block",
            },
        },
    ]);

    registerContentScript(ConfigKey.FixPortalLinkEnabled, [
        {
            id: "fix-portal-link",
            matches: ["https://coursereg.waseda.jp/portal/simpleportal.php?*"],
            js: ["/fix-portal-link/content.js"],
            runAt: "document_end",
        },
    ]);
}
