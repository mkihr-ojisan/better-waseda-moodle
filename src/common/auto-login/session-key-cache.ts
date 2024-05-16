import { assertExtensionContext } from "../util/context";
import { doAutoLogin } from "./auto-login";

assertExtensionContext("background");

const SESSION_KEY_CACHE_DURATION = 2 * 60 * 60 * 1000;

/**
 * Waseda Moodleのセッションキーを取得する。
 * キャッシュが有効な場合はキャッシュを返す。
 */
export async function getSessionKey(): Promise<string> {
    const cache = (await browser.storage.local.get("session_key_cache")).session_key_cache;

    if (!cache || cache.expireAt < new Date().getTime()) {
        await doAutoLogin();
        if (!cache) throw Error("cache is null"); // doAutoLogin内でキャッシュが設定されるはずである
    }
    return cache.sessionKey;
}

/**
 * Waseda Moodleのセッションキーをキャッシュする。
 *
 * @param sessionKey - セッションキー
 */
export async function setSessionKeyCache(sessionKey: string): Promise<void> {
    await browser.storage.local.set({
        session_key_cache: { sessionKey, expireAt: Date.now() + SESSION_KEY_CACHE_DURATION },
    });
}
