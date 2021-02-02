import { getConfig, removeConfig, setConfig, AUTO_LOGIN_ENABLED, AUTO_LOGIN_ID, AUTO_LOGIN_PASSWORD } from '../config';

const checkboxAutoLogin = document.createElement('input');
const labelAutoLogin = document.createElement('label');
checkboxAutoLogin.id = 'bwmAutoLogin';
checkboxAutoLogin.type = 'checkbox';
getConfig<boolean>(AUTO_LOGIN_ENABLED).then(enabled => checkboxAutoLogin.checked = enabled === true);
labelAutoLogin.htmlFor = checkboxAutoLogin.id;
labelAutoLogin.textContent = browser.i18n.getMessage('autoLoginCheckboxLabel');

document.getElementById('wrapper-password')?.insertAdjacentElement('afterend', checkboxAutoLogin);
checkboxAutoLogin.insertAdjacentElement('afterend', labelAutoLogin);

document.getElementById('login')?.addEventListener('submit', () => {
    setConfig<boolean>(AUTO_LOGIN_ENABLED, checkboxAutoLogin.checked);

    if (checkboxAutoLogin.checked) {
        const elemLoginId = document.getElementById('j_username') as HTMLInputElement;
        const elemPassword = document.getElementById('j_password') as HTMLInputElement;

        setConfig<string>(AUTO_LOGIN_ID, elemLoginId.value);
        setConfig<string>(AUTO_LOGIN_PASSWORD, elemPassword.value);
    } else {
        removeConfig(AUTO_LOGIN_ID);
        removeConfig(AUTO_LOGIN_PASSWORD);
    }
});