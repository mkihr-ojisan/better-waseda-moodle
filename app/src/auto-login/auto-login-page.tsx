import React from 'react';
import ReactDOM from 'react-dom';
import { PromiseProgressEvent } from '../common/util/ExPromise';
import { MessengerClient } from '../common/util/messenger';
import AutoLoginPage, { AutoLoginPageProps } from './components/AutoLoginPage';

document.title = browser.i18n.getMessage('autoLoginPageTitle');

(async () => {
    try {
        const promise = MessengerClient.exec('doLogin');
        promise.addEventListener('progress', (event) => {
            setProps({
                progress: (event as PromiseProgressEvent<number>).progress,
            });
        });
        await promise;

        const redirectUrl = new URL(location.href).searchParams.get('redirectUrl') || 'https://wsdmoodle.waseda.jp/my/';
        if (redirectUrl) {
            location.replace(redirectUrl);
        }
    } catch (ex) {
        setProps({
            error: ex.toString(),
            progress: 0,
        });
    }
})();

function setProps(props: AutoLoginPageProps) {
    ReactDOM.render(<AutoLoginPage {...props} />, document.getElementById('container'));
}
setProps({ error: undefined, progress: 0 });
