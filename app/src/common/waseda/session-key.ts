import { ensureLogin } from '../../auto-login/auto-login';
import { InvalidResponseError } from '../error';
import { MessengerServer } from '../util/messenger';
import { assertCurrentContextType, fetchHtml, postJson } from '../util/util';

assertCurrentContextType('background_script');

let cache: {
    sessionKey: string;
    expireAt: Date;
} | null = null;

export async function fetchSessionKey(force?: boolean, noLogin?: boolean): Promise<string> {
    if (force || !cache || cache.expireAt < new Date()) {
        if (!noLogin) await ensureLogin();

        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 2); //TODO: 要検証

        const moodleTop = await fetchHtml('https://wsdmoodle.waseda.jp/my/');
        const sessionKey = moodleTop
            .querySelector('a[href^="https://wsdmoodle.waseda.jp/login/logout.php?sesskey="]')
            ?.getAttribute('href')
            ?.split('=')[1];
        if (!sessionKey) throw new InvalidResponseError('cannot find session key');

        cache = {
            sessionKey,
            expireAt,
        };
    }

    return cache.sessionKey;
}

export function getSessionKeyCache(): string | undefined {
    if (cache && cache.expireAt > new Date()) {
        return cache.sessionKey;
    }
}

export function setSessionKeyCache(sessionKey: string, expireAt?: Date): void {
    if (!expireAt) {
        expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 2);
    }

    cache = { sessionKey, expireAt };
}

export async function checkSessionAlive(sessionKey: string): Promise<boolean> {
    const response = await postJson(`https://wsdmoodle.waseda.jp/lib/ajax/service.php?sesskey=${sessionKey}`, [
        {
            index: 0,
            methodname: 'core_session_touch',
            args: {},
        },
    ]);

    return !!response[0]?.data;
}
MessengerServer.addInstruction({ checkSessionAlive });
