import { assertExtensionContext } from "./common/util/context";
import { call } from "./common/util/messenger/client";

assertExtensionContext(["content_script", "extension_page"]);

// Q. なぜ個別にコンテンツスクリプトを登録するのではなく、ここからそれぞれの機能を呼び出しているのか？
// A. エントリポイントが増えると、それぞれにReactなどのライブラリがバンドルされてクソデカ拡張機能になってしまうため
// Q. Webpackのcode splittingを使えばいいじゃん
// A. コンテンツスクリプト上ではWebpackのchunkをロードする機能が動かなくて……
(async () => {
    const sessionKey = document
        .querySelector('a[href^="https://wsdmoodle.waseda.jp/login/logout.php?sesskey="]')
        ?.getAttribute("href")
        ?.match(/sesskey=(.*)$/)?.[1];
    if (sessionKey) {
        // セッションキーが要る機能もあると思うのでawaitする
        await call("setSessionKeyCache", sessionKey);
    }

    if (location.host === "wsdmoodle.waseda.jp") {
        if (location.pathname === "/my/" || location.pathname === "/my/index.php") {
            import("./dashboard/course-overview/course-overview");
        }
        if (location.pathname === "/mod/quiz/attempt.php") {
            import("./quiz/remind-unanswered-questions/content");
        }
        if (
            location.pathname === "/mod/quiz/attempt.php" ||
            location.pathname === "/mod/assign/view.php" ||
            location.pathname.startsWith("/mod/forum/")
        ) {
            import("./check-session/content");
        }
    } else if (
        (process.env.VENDOR === "firefox" && location.protocol === "moz-extension:") ||
        (process.env.VENDOR === "chrome" && location.protocol === "chrome-extension:")
    ) {
        if (location.pathname === "/options-page/options-page.html") {
            import("./options-page/options-page");
        }
    }
})();
