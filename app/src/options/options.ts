import { setConfig, onConfigChange } from '../common/config/config';

//#region data-*の処理
document.querySelectorAll('[data-message]').forEach(elem => {
    const message = elem.getAttribute('data-message');
    if (!message) throw Error('message is null');
    elem.innerHTML = browser.i18n.getMessage(message);
});
document.querySelectorAll('[data-if]').forEach(elem => {
    const key = elem.getAttribute('data-if');
    if (!key) throw Error('key is null');

    onConfigChange(key, (_, newValue) => {
        if (newValue) {
            (elem as HTMLElement).style.display = 'unset';
        } else {
            (elem as HTMLElement).style.display = 'none';
        }
    }, true);
});
document.querySelectorAll('[data-if-not]').forEach(elem => {
    const key = elem.getAttribute('data-if-not');
    if (!key) throw Error('key is null');

    onConfigChange(key, (_, newValue) => {
        if (newValue) {
            (elem as HTMLElement).style.display = 'none';
        } else {
            (elem as HTMLElement).style.display = 'unset';
        }
    }, true);
});
document.querySelectorAll('[data-enabled-if]').forEach(elem => {
    const key = elem.getAttribute('data-enabled-if');
    if (!key) throw Error('key is null');
    if (!(elem instanceof HTMLInputElement)) throw Error('elem must be HTMLInputElement');

    onConfigChange(key, (_, newValue) => {
        elem.disabled = !newValue;
    }, true);
});
document.querySelectorAll('[data-enabled-if-not]').forEach(elem => {
    const key = elem.getAttribute('data-enabled-if-not');
    if (!key) throw Error('key is null');
    if (!(elem instanceof HTMLInputElement)) throw Error('elem must be HTMLInputElement');

    onConfigChange(key, (_, newValue) => {
        elem.disabled = !!newValue;
    }, true);
});
document.querySelectorAll('[data-config-value]').forEach(elem => {
    const key = elem.getAttribute('data-config-value');
    if (!key) throw Error('key is null');
    if (!(elem instanceof HTMLInputElement)) throw Error('elem must be HTMLInputElement');

    onConfigChange<string>(key, (_, newValue) => {
        elem.value = newValue;
    }, true);
    elem.addEventListener('change', () => {
        setConfig<string>(key, elem.value);
    });
});
document.querySelectorAll('[data-config-checked]').forEach(elem => {
    const key = elem.getAttribute('data-config-checked');
    if (!key) throw Error('key is null');
    if (!(elem instanceof HTMLInputElement)) throw Error('elem must be HTMLInputElement');

    onConfigChange<boolean>(key, (_, newValue) => {
        elem.checked = newValue;
    }, true);
    elem.addEventListener('change', () => {
        setConfig<boolean>(key, elem.checked);
    });
});
//#endregion

