import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";

/**
 * トラッキングをブロックする機能を初期化する
 */
export function initBlockTracking(): void {
    const block1 = (details: browser.webRequest._OnBeforeRequestDetails) => {
        return { cancel: details.url.includes("local_intelldata_save_tracking") };
    };

    const block2 = () => {
        return { cancel: true };
    };

    addOnConfigChangeListener(
        ConfigKey.BlockTracking,
        (value) => {
            if (value) {
                browser.webRequest.onBeforeRequest.addListener(
                    block1,
                    { urls: ["https://wsdmoodle.waseda.jp/lib/ajax/service.php?*"] },
                    ["blocking"]
                );
                browser.webRequest.onBeforeRequest.addListener(
                    block2,
                    { urls: ["https://wsdmoodle.waseda.jp/local/intelliboard/ajax.php"] },
                    ["blocking"]
                );
            } else {
                browser.webRequest.onBeforeRequest.removeListener(block1);
                browser.webRequest.onBeforeRequest.removeListener(block2);
            }
        },
        true
    );
}
