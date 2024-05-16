import { assertExtensionContext } from "../util/context";
import { call } from "../util/messenger/client";

assertExtensionContext("extension_page");

document.title = browser.i18n.getMessage("auto_login_page_title");

(async (): Promise<void> => {
    try {
        await call("doAutoLogin", {
            skipCheck: true,
            skipSessionKey: true,
            skipMoodleAuthSaml2Login: process.env.VENDOR === "chrome",
        });

        if (process.env.VENDOR === "firefox") {
            const redirectUrl = new URLSearchParams(location.search).get("redirectUrl");
            location.replace(redirectUrl ?? "https://wsdmoodle.waseda.jp/");
        } else {
            location.replace(
                "https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off"
            );
        }
    } catch (e) {
        // 自動ログインに失敗した場合は自動的に普通のログインページに遷移する
        location.replace(
            "https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off"
        );
    }
})();
