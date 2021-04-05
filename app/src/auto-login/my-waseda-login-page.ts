import { getConfig, removeConfig, setConfig } from '../common/config/config';

const checkboxAutoLogin = document.createElement('input');
const labelAutoLogin = document.createElement('label');
checkboxAutoLogin.id = 'bwmAutoLogin';
checkboxAutoLogin.type = 'checkbox';
labelAutoLogin.htmlFor = checkboxAutoLogin.id;
labelAutoLogin.textContent = browser.i18n.getMessage('autoLoginCheckboxLabel');

document.getElementById('wrapper-password')?.insertAdjacentElement('afterend', checkboxAutoLogin);
checkboxAutoLogin.insertAdjacentElement('afterend', labelAutoLogin);

getConfig('autoLogin.enabled').then(enabled => checkboxAutoLogin.checked = enabled === true);

document.getElementById('login')?.addEventListener('submit', () => {
    setConfig('autoLogin.enabled', checkboxAutoLogin.checked);

    if (checkboxAutoLogin.checked) {
        const elemLoginId = document.getElementById('j_username') as HTMLInputElement;
        const elemPassword = document.getElementById('j_password') as HTMLInputElement;

        setConfig('autoLogin.loginId', elemLoginId.value);
        setConfig('autoLogin.password', elemPassword.value);
    } else {
        removeConfig('autoLogin.loginId');
        removeConfig('autoLogin.password');
    }
});