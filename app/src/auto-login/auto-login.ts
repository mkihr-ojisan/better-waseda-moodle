import { getConfig, onConfigChange } from '../common/config/config';
import { login } from '../common/waseda/login';
import { LoginRequiredError } from '../common/error';

export async function initAutoLogin(): Promise<void> {
    onConfigChange('autoLogin.enabled', (_, newValue) => {
        if (newValue) {
            browser.webRequest.onHeadersReceived.addListener(
                onHeaderReceivedListener,
                { urls: ['https://wsdmoodle.waseda.jp/*'] },
                ['blocking', 'responseHeaders'],
            );
            browser.webRequest.onBeforeRequest.addListener(
                onBeforeRequestListener,
                { urls: ['https://wsdmoodle.waseda.jp/login/index.php'] },
                ['blocking'],
            );
        } else {
            browser.webRequest.onHeadersReceived.removeListener(onHeaderReceivedListener);
            browser.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener);
        }

    }, true);
}

const requestedUrls = new Map<string, string>();

// ログインページにリダイレクトするようなレスポンスを見つけ、リクエストしていたURLを記憶する
function onHeaderReceivedListener(details: browser.webRequest._OnHeadersReceivedDetails) {
    if (details.statusCode === 302 || details.statusCode === 303) {
        for (const header of details.responseHeaders ?? []) {
            if (header.name.toLowerCase() === 'location' && header.value === 'https://wsdmoodle.waseda.jp/login/index.php') {
                requestedUrls.set(details.requestId, details.url);
            }
        }
    }

    return {};
}

// ログインページへのリクエストをブロックして、代わりにauto-login-page.htmlに遷移させる
function onBeforeRequestListener(details: browser.webRequest._OnBeforeRequestDetails) {
    const redirectUrl = requestedUrls.get(details.requestId) ?? 'https://wsdmoodle.waseda.jp/my/';
    requestedUrls.delete(details.requestId);

    return {
        redirectUrl: browser.runtime.getURL(`/src/auto-login/auto-login-page.html?redirectUrl=${encodeURIComponent(redirectUrl)}`),
    };
}

export async function doLogin(): Promise<boolean> {
    if (await getConfig('autoLogin.enabled')) {
        const userId = await getConfig('autoLogin.loginId');
        const password = await getConfig('autoLogin.password');
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
export async function ensureLogin(): Promise<void> {
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
            } else {
                throw new LoginRequiredError();
            }
        } else {
            lastEnsureLogin = Date.now();
        }
    } 
}