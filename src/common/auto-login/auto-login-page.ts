import { assertExtensionContext } from "../util/context";
import { call } from "../util/messenger/client";

assertExtensionContext("extension_page");

document.title = browser.i18n.getMessage("auto_login_page_title");

(async (): Promise<void> => {
    try {
        await call("doAutoLogin");

        const redirectUrl = new URLSearchParams(location.search).get("redirectUrl");
        location.href = redirectUrl ?? "https://wsdmoodle.waseda.jp/";
    } catch (e) {
        // 自動ログインに失敗した場合は自動的に普通のログインページに遷移する
        location.href =
            "https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off";
    }
})();
