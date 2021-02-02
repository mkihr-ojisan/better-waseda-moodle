import { messengerServer } from '../background';
import { getConfig, AUTO_LOGIN_ENABLED, AUTO_LOGIN_ID, AUTO_LOGIN_PASSWORD } from '../config';
import { fetchHtml } from '../tools';

export function initAutoLogin(): void {
    browser.webRequest.onHeadersReceived.addListener(
        webRequestListener,
        { urls: ['https://wsdmoodle.waseda.jp/*'] },
        ['blocking', 'responseHeaders']
    );

    messengerServer.addInstruction('doLogin', doLogin);
}
async function webRequestListener(details: browser.webRequest._OnHeadersReceivedDetails) {
    // ログインページにリダイレクトされたときにリダイレクト先を/src/autoLogin/autoLoginPage.htmlに変更する
    // doLogin中は何もしない
    if (doLoginPromise) return {};
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
            const cookies_promise = ['.waseda.jp'].map(
                domain => browser.cookies.getAll({ domain })
            );
            const cookies = await Promise.all(cookies_promise);

            const remove_promise = [];
            for (const cookies_domain of cookies) {
                for (const cookie of cookies_domain) {
                    remove_promise.push(browser.cookies.remove({
                        url: 'https://' + cookie.domain + cookie.path,
                        name: cookie.name,
                    }));
                }
            }

            await Promise.all(remove_promise);
        } finally {
            logoutPromise = null;
        }
    })();

    return await logoutPromise;
}