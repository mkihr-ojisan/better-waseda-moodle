import { InternalError } from '../common/error';
import { MessengerClient } from '../common/util/messenger';

const elemMessage = document.getElementById('message');
const btnGotoFallbackPage = document.getElementById('gotoFallbackPage');
if (!elemMessage || !btnGotoFallbackPage) throw new InternalError('unexpected error');

document.title = browser.i18n.getMessage('autoLoginPageTitle');
elemMessage.textContent = browser.i18n.getMessage('autoLoginPageMessage');

btnGotoFallbackPage.textContent = browser.i18n.getMessage('autoLoginFallbackButtonText');
btnGotoFallbackPage.addEventListener('click', () => {
    location.replace(
        'https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off'
    );
});

(async () => {
    try {
        await MessengerClient.exec('doLogin');

        const redirectUrl = new URL(location.href).searchParams.get('redirectUrl');
        if (redirectUrl) {
            location.replace(redirectUrl);
        }
    } catch (ex) {
        document.body.classList.add('error');
        elemMessage.textContent = browser.i18n.getMessage('autoLoginFailedMessage');
        btnGotoFallbackPage.style.visibility = 'visible';
    }
})();
