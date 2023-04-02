import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";

/**
 * 成績照会・科目登録専用メニューのリンクを修正する機能を初期化する
 */
export function initFixPortalLink(): void {
    // fncControlSubmit.jsを置き換えることで、
    // 「ただいま処理中です。OKボタンを押して、しばらく待ってから再度メニューをクリックしてください。」
    // が出ないようにする。

    addOnConfigChangeListener(ConfigKey.FixPortalLinkEnabled, (enabled) => {
        if (enabled) {
            browser.webRequest.onBeforeRequest.addListener(
                listener,
                { urls: ["https://coursereg.waseda.jp/portal/common/fncControlSubmit.js"] },
                ["blocking"]
            );
        } else {
            browser.webRequest.onBeforeRequest.removeListener(listener);
        }
    });
}

const listener = (): browser.webRequest.BlockingResponse => {
    return { redirectUrl: "data:text/javascript,function fncControlSubmit() { return true; }" };
};
