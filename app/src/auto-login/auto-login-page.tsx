import React from 'react';
import ReactDOM from 'react-dom';
import { MessengerClient } from '../common/util/messenger';
import AutoLoginPage, { AutoLoginPageProps } from './components/AutoLoginPage';

document.title = browser.i18n.getMessage('autoLoginPageTitle');

function render(props: AutoLoginPageProps) {
    ReactDOM.render(<AutoLoginPage {...props} />, document.getElementById('container'));
}

(async () => {
    try {
        render({});

        await MessengerClient.exec('doLogin');

        const redirectUrl = new URL(location.href).searchParams.get('redirectUrl') || 'https://wsdmoodle.waseda.jp/my/';
        if (redirectUrl) {
            location.replace(redirectUrl);
        }
    } catch (ex) {
        render({ error: `${ex}` });
    }
})();
