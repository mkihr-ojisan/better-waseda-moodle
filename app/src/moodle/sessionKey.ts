import { ensureLogin } from '../autoLogin/autoLogin';
import { fetchHtml } from '../util/util';

let cache: {
    sessionKey: string,
    expireAt: Date,
} | null = null;

export async function fetchSessionKey(): Promise<string> {
    if (!cache || cache.expireAt < new Date()) {
        await ensureLogin();

        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 2); //TODO: 要検証

        const moodleTop = await fetchHtml('https://wsdmoodle.waseda.jp/my/');
        const sessionKey = moodleTop.querySelector('a[href^="https://wsdmoodle.waseda.jp/login/logout.php?sesskey="]')?.getAttribute('href')?.split('=')[1];
        if (!sessionKey) throw Error('cannot find session key');

        cache = {
            sessionKey,
            expireAt,
        };
    }

    return cache.sessionKey;
}