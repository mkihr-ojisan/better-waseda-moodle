import { messengerServer } from '../background';
import { getConfig, setConfig } from '../config/config';
import { getConfigCache } from '../config/configCache';
import { AUTO_LOGIN_ENABLED, AUTO_LOGIN_ID, AUTO_LOGIN_PASSWORD } from '../config/configKeys';
import { fetchHtml, getBrowser } from '../tools';

export async function initAutoLogin(): Promise<void> {
    switch (await getBrowser()) {
        case 'firefox':
            browser.webRequest.onHeadersReceived.addListener(
                webRequestListenerFirefox,
                { urls: ['https://wsdmoodle.waseda.jp/*'] },
                ['blocking', 'responseHeaders']
            );
            break;
        case 'other':
            browser.webRequest.onBeforeRequest.addListener(
                webRequestListenerOtherBrowser,
                { urls: ['https://wsdmoodle.waseda.jp/*'] },
                ['blocking']
            );
            break;
    }

    messengerServer.addInstruction('doLogin', doLogin);
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

let doLoginPromise: Promise<string> | null = null;
export async function doLogin(): Promise<string> {
    if (doLoginPromise) {
        return await doLoginPromise;
    }

    doLoginPromise = (async () => {
        try {
            await logout();

            const loginPage = await fetchHtml('https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off');

            const loginInfoPostUrl = loginPage.getElementById('login')?.getAttribute('action');
            if (!loginInfoPostUrl) throw Error('cannot find loginInfoPostUrl');

            const loginInfoPostUrlFull = new URL(loginInfoPostUrl, 'https://iaidp.ia.waseda.jp/');

            const csrfToken = loginPage.querySelector('input[name="csrf_token"]')?.getAttribute('value');
            if (!csrfToken) throw Error('cannot find csrfToken');

            const userId = await getConfig<string>(AUTO_LOGIN_ID);
            const password = await getConfig<string>(AUTO_LOGIN_PASSWORD);
            if (!userId || !password) throw Error('userId or password is not set');

            const loginResponse = await fetchHtml(loginInfoPostUrlFull.href, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: `csrf_token=${csrfToken}&j_username=${encodeURIComponent(userId)}&j_password=${encodeURIComponent(password)}&_eventId_proceed=Login`,
            });

            console.log(loginResponse);

            const RelayState = loginResponse.querySelector('input[name="RelayState"]')?.getAttribute('value');
            if (!RelayState) throw Error('cannot find RelayState');
            const SAMLResponse = loginResponse.querySelector('input[name="SAMLResponse"]')?.getAttribute('value');
            if (!SAMLResponse) throw Error('cannot find SAMLResponse');

            const moodleTopPostUrl = loginResponse.getElementsByTagName('form')[0]?.getAttribute('action');
            if (!moodleTopPostUrl) throw Error('moodleTopPostUrl');
            const moodleTop = await fetchHtml(moodleTopPostUrl, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: `RelayState=${encodeURIComponent(RelayState)}&SAMLResponse=${encodeURIComponent(SAMLResponse)}`,
            });

            const sessionKey = moodleTop.querySelector('[data-title="logout,moodle"]')?.getAttribute('href')?.match(/sesskey=(.*)$/)?.[1];
            if (!sessionKey) throw Error('cannot find sessionKey');

            const sessionKeyExpire = new Date();
            sessionKeyExpire.setHours(sessionKeyExpire.getDate() + 1);

            return sessionKey;
        } catch (ex) {
            //自動ログインが失敗したら自動ログインを無効にする。
            await setConfig(AUTO_LOGIN_ENABLED, false);
            throw ex;
        } finally {
            doLoginPromise = null;
        }
    })();

    return await doLoginPromise;
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

    return await logoutPromise;
}