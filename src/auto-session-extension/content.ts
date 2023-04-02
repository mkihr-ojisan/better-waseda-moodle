import { checkSessionKey } from "@/common/api/moodle/checkSessionKey";

(() => {
    const INTERVAL_MINUTES = 60;

    const sessionKey = document
        .querySelector('a[href^="https://wsdmoodle.waseda.jp/login/logout.php?sesskey="]')
        ?.getAttribute("href")
        ?.match(/sesskey=(.*)$/)?.[1];

    if (!sessionKey) {
        console.warn("Session key not found");
        return;
    }

    const timer = setInterval(async () => {
        if (!(await checkSessionKey(sessionKey))) {
            clearInterval(timer);
            console.warn("Session key expired");
        }
    }, INTERVAL_MINUTES * 60 * 1000);
})();
