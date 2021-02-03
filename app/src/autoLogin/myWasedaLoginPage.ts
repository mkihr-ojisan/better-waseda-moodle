import { AUTO_LOGIN_ENABLED, AUTO_LOGIN_ID, AUTO_LOGIN_PASSWORD } from '../config';
import { MessengerClient } from '../messenger';

const checkboxAutoLogin = document.createElement('input');
const labelAutoLogin = document.createElement('label');
checkboxAutoLogin.id = 'bwmAutoLogin';
checkboxAutoLogin.type = 'checkbox';
labelAutoLogin.htmlFor = checkboxAutoLogin.id;
labelAutoLogin.textContent = browser.i18n.getMessage('autoLoginCheckboxLabel');

document.getElementById('wrapper-password')?.insertAdjacentElement('afterend', checkboxAutoLogin);
checkboxAutoLogin.insertAdjacentElement('afterend', labelAutoLogin);

const messenger = new MessengerClient();
messenger.exec('getConfig', AUTO_LOGIN_ENABLED).then(enabled => checkboxAutoLogin.checked = enabled === true);

document.getElementById('login')?.addEventListener('submit', () => {
    messenger.exec('setConfig', AUTO_LOGIN_ENABLED, checkboxAutoLogin.checked);

    if (checkboxAutoLogin.checked) {
        const elemLoginId = document.getElementById('j_username') as HTMLInputElement;
        const elemPassword = document.getElementById('j_password') as HTMLInputElement;

        messenger.exec('setConfig', AUTO_LOGIN_ID, elemLoginId.value);
        messenger.exec('setConfig', AUTO_LOGIN_PASSWORD, elemPassword.value);
    } else {
        messenger.exec('removeConfig', AUTO_LOGIN_ID);
        messenger.exec('removeConfig', AUTO_LOGIN_PASSWORD);
    }
});