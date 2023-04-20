import { LoginOptions, login } from "../api/waseda/login";
import { core_session_touch } from "../api/moodle/touch";
import { ConfigKey, getConfig } from "../config/config";
import { LoginRequiredError } from "../error";
import { combinePromise } from "../util/combine-promise";
import { assertExtensionContext } from "../util/context";
import { setSessionKeyCache } from "./session-key-cache";
import { synchronized } from "../util/synchronized";

assertExtensionContext("background");

const ENSURE_LOGIN_INTERVAL = 10 * 1000;

let lastEnsureLogin: number | null = null;

/**
 * Configで指定されたログイン情報を使用して、自動ログインを実行する。
 *
 * @throws LoginRequiredError 自動ログインが有効になっていない場合
 */
export const doAutoLogin = combinePromise(
    synchronized(async (options?: LoginOptions) => {
        console.time("login");
        const sessionKey = await login(
            {
                get: () => {
                    const loginInfo = getConfig(ConfigKey.LoginInfo);
                    if (!loginInfo.password || !loginInfo.userId) throw new LoginRequiredError();
                    return loginInfo;
                },
            },
            options
        );
        console.timeEnd("login");

        if (sessionKey) setSessionKeyCache(sessionKey);
        lastEnsureLogin = Date.now();
    })
);

/** ログインされているか確認し、されていなければ自動ログインを実行する。確認する間隔は10秒。 */
export const ensureLogin = combinePromise(async () => {
    if (lastEnsureLogin !== null && Date.now() - lastEnsureLogin < ENSURE_LOGIN_INTERVAL) return;

    try {
        await core_session_touch();
    } catch (e) {
        await doAutoLogin();
    }

    lastEnsureLogin = Date.now();
});
