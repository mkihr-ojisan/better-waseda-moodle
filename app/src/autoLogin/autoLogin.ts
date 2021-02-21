import { messengerServer } from '../background';
import { getConfig } from '../common/config/config';
import { getConfigCache } from '../common/config/configCache';
import { AUTO_LOGIN_ENABLED, AUTO_LOGIN_ID, AUTO_LOGIN_PASSWORD } from '../common/config/configKeys';
import { login } from '../common/waseda/login';
import { VENDOR } from '../common/util/util';

export async function initAutoLogin(): Promise<void> {
    switch (VENDOR) {
        case 'firefox':
            browser.webRequest.onHeadersReceived.addListener(
                webRequestListenerFirefox,
                { urls: ['https://wsdmoodle.waseda.jp/*'] },
                ['blocking', 'responseHeaders']
            );
            break;
        default:
            browser.webRequest.onBeforeRequest.addListener(
                webRequestListenerOtherBrowser,
                { urls: ['https://wsdmoodle.waseda.jp/*'] },
                ['blocking']
            );
            break;
    }

    messengerServer.addInstruction('doLogin', doLogin);
    messengerServer.addInstruction('logout', logout);
}

// バグだかなんだか知らんがこれはFirefoxでしか動かない
async function webRequestListenerFirefox(details: browser.webRequest._OnHeadersReceivedDetails) {
    // ログインページにリダイレクトされたときにリダイレクト先を/src/autoLogin/autoLoginPage.htmlに変更する
    if (details.statusCode === 302 || details.statusCode === 303) {
        for (const header of details.responseHeaders ?? []) {
            if (header.name.toLowerCase() === 'location' && header.value === 'https://wsdmoodle.waseda.jp/login/index.php') {
                if (!await getConfig(AUTO_LOGIN_ENABLED)) return {};
                return {
                    redirectUrl: browser.runtime.getURL(`/src/autoLogin/autoLoginPage.html?redirectUrl=${encodeURIComponent(details.url)}`),
                };
            }
        }
    }

    return {};
}

// これはFirefox以外でも動く
function webRequestListenerOtherBrowser(details: browser.webRequest._OnBeforeRequestDetails) {
    // asyncなlistenerはfirefox以外で使えないのでgetConfigCacheを使う
    if (getConfigCache(AUTO_LOGIN_ENABLED) && details.url === 'https://wsdmoodle.waseda.jp/login/index.php') {
        return {
            // アクセスしようとしていたページがわからないのでMoodleのトップページに飛ばしておく
            redirectUrl: browser.runtime.getURL(`/src/autoLogin/autoLoginPage.html?redirectUrl=${encodeURIComponent('https://wsdmoodle.waseda.jp/my/')}`)
        };
    }
}

export async function doLogin(): Promise<boolean> {
    if (await getConfig<boolean>(AUTO_LOGIN_ENABLED)) {
        const userId = await getConfig<string>(AUTO_LOGIN_ID);
        const password = await getConfig<string>(AUTO_LOGIN_PASSWORD);
        await login(userId, password);
        lastEnsureLogin = Date.now();
        return true;
    } else {
        return false;
    }
}


let logoutPromise: Promise<void> | null = null;
export async function logout(): Promise<void> {
    if (logoutPromise) {
        return await logoutPromise;
    }
    logoutPromise = (async () => {
        try {
            await Promise.all(['my.waseda.jp', 'iaidp.ia.waseda.jp', 'wsdmoodle.waseda.jp'].map(async domain => {
                const cookies = await browser.cookies.getAll({ domain });
                await Promise.all(cookies.map(cookie => browser.cookies.remove({ url: `https://${cookie.domain}${cookie.path}`, name: cookie.name })));
            }));
        } finally {
            logoutPromise = null;
        }
    })();
    lastEnsureLogin = null;

    return await logoutPromise;
}

let lastEnsureLogin: number | null = null;
export async function ensureLogin(): Promise<boolean> {
    if (!lastEnsureLogin || lastEnsureLogin + 60000 < Date.now()) { //1分くらいは勝手にログアウトされんやろ
        const response = await fetch('https://wsdmoodle.waseda.jp/my/', {
            method: 'HEAD',
            credentials: 'include',
            mode: 'cors',
            redirect: 'manual',
        });

        if (response.redirected) {
            if (await doLogin()) {
                lastEnsureLogin = Date.now();
                return true;
            } else {
                throw Error('auto login is disabled');
            }
        } else {
            lastEnsureLogin = Date.now();
            return true;
        }
    } else {
        return true;
    }
}