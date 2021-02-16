import { messengerServer } from '../background';
import { getConfig } from '../config/config';
import { getConfigCache } from '../config/configCache';
import { AUTO_LOGIN_ENABLED, AUTO_LOGIN_ID, AUTO_LOGIN_PASSWORD } from '../config/configKeys';
import { login, logout } from '../moodle/login';
import { getBrowser } from '../util/util';

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

async function doLogin() {
    const userId = await getConfig<string>(AUTO_LOGIN_ID);
    const password = await getConfig<string>(AUTO_LOGIN_PASSWORD);
    await login(userId, password);
}