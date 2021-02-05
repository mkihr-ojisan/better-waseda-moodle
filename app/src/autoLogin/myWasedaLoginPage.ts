import { getConfig, removeConfig, setConfig } from '../config/config';
import { AUTO_LOGIN_ENABLED, AUTO_LOGIN_ID, AUTO_LOGIN_PASSWORD } from '../config/configKeys';

const checkboxAutoLogin = document.createElement('input');
const labelAutoLogin = document.createElement('label');
checkboxAutoLogin.id = 'bwmAutoLogin';
checkboxAutoLogin.type = 'checkbox';
labelAutoLogin.htmlFor = checkboxAutoLogin.id;
labelAutoLogin.textContent = browser.i18n.getMessage('autoLoginCheckboxLabel');

document.getElementById('wrapper-password')?.insertAdjacentElement('afterend', checkboxAutoLogin);
checkboxAutoLogin.insertAdjacentElement('afterend', labelAutoLogin);

getConfig(AUTO_LOGIN_ENABLED).then(enabled => checkboxAutoLogin.checked = enabled === true);

document.getElementById('login')?.addEventListener('submit', () => {
    setConfig(AUTO_LOGIN_ENABLED, checkboxAutoLogin.checked);

    if (checkboxAutoLogin.checked) {
        const elemLoginId = document.getElementById('j_username') as HTMLInputElement;
        const elemPassword = document.getElementById('j_password') as HTMLInputElement;

        setConfig(AUTO_LOGIN_ID, elemLoginId.value);
        setConfig(AUTO_LOGIN_PASSWORD, elemPassword.value);
    } else {
        removeConfig(AUTO_LOGIN_ID);
        removeConfig(AUTO_LOGIN_PASSWORD);
    }
});