import React from 'react';
import ReactDOM from 'react-dom';
import { ProgressPromise, PromiseProgressEvent } from '../common/util/ExPromise';
import { MessengerClient } from '../common/util/messenger';
import AutoLoginPage, { AutoLoginPageProps } from './components/AutoLoginPage';

document.title = browser.i18n.getMessage('autoLoginPageTitle');

function setProps(props: AutoLoginPageProps) {
    ReactDOM.render(<AutoLoginPage {...props} />, document.getElementById('container'));
}

(async () => {
    try {
        const promise = MessengerClient.exec('doLogin') as ProgressPromise<void, number>;
        promise.addEventListener('progress', (event) => {
            setProps({ progress: (event as PromiseProgressEvent<number>).progress });
        });
        setProps({ progress: promise.currentProgress ?? 0 });
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
