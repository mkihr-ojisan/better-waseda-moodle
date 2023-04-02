import { assertExtensionContext } from "../util/context";
import { doAutoLogin } from "./auto-login";

assertExtensionContext("background");

const SESSION_KEY_CACHE_DURATION = 2 * 60 * 60 * 1000;

let cache: { sessionKey: string; expireAt: Date } | null = null;

/**
 * Waseda Moodleのセッションキーを取得する。
 * キャッシュが有効な場合はキャッシュを返す。
 */
export async function getSessionKey(): Promise<string> {
    if (cache === null || cache.expireAt < new Date()) {
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
export function setSessionKeyCache(sessionKey: string): void {
    cache = { sessionKey, expireAt: new Date(Date.now() + SESSION_KEY_CACHE_DURATION) };
}
