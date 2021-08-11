import { logout } from '../../auto-login/auto-login';
import { InvalidResponseError, UserIdOrPasswordNotSetError } from '../error';
import { createProgressPromise, ProgressPromise } from '../util/ExPromise';
import { assertCurrentContextType, fetchHtml } from '../util/util';

assertCurrentContextType('background_script');

let loginPromise: ProgressPromise<string, number> | null = null;
export function login(userId: string, password: string): ProgressPromise<string, number> {
    if (loginPromise) {
        return loginPromise;
    }

    loginPromise = createProgressPromise(async (reportProgress) => {
        try {
            await logout();
            reportProgress(1 / 4);

            const loginPage = await fetchHtml(
                'https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off'
            );

            const loginInfoPostUrl = loginPage.getElementById('login')?.getAttribute('action');
            if (!loginInfoPostUrl) throw new InvalidResponseError('cannot find loginInfoPostUrl');

            const loginInfoPostUrlFull = new URL(loginInfoPostUrl, 'https://iaidp.ia.waseda.jp/');

            const csrfToken = loginPage.querySelector('input[name="csrf_token"]')?.getAttribute('value');
            if (!csrfToken) throw new InvalidResponseError('cannot find csrfToken');

            if (!userId || !password) throw new UserIdOrPasswordNotSetError();

            reportProgress(2 / 4);
            const loginResponse = await fetchHtml(loginInfoPostUrlFull.href, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: `csrf_token=${csrfToken}&j_username=${encodeURIComponent(userId)}&j_password=${encodeURIComponent(
                    password
                )}&_eventId_proceed=Login`,
            });

            const RelayState = loginResponse.querySelector('input[name="RelayState"]')?.getAttribute('value');
            if (!RelayState) throw new InvalidResponseError('cannot find RelayState');
            const SAMLResponse = loginResponse.querySelector('input[name="SAMLResponse"]')?.getAttribute('value');
            if (!SAMLResponse) throw new InvalidResponseError('cannot find SAMLResponse');

            const moodleTopPostUrl = loginResponse.getElementsByTagName('form')[0]?.getAttribute('action');
            if (!moodleTopPostUrl) throw new InvalidResponseError('moodleTopPostUrl');
            reportProgress(3 / 4);
            const moodleTop = await fetchHtml(moodleTopPostUrl, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: `RelayState=${encodeURIComponent(RelayState)}&SAMLResponse=${encodeURIComponent(SAMLResponse)}`,
            });

            const sessionKey = moodleTop
                .querySelector('[data-title="logout,moodle"]')
                ?.getAttribute('href')
                ?.match(/sesskey=(.*)$/)?.[1];
            if (!sessionKey) throw new InvalidResponseError('cannot find sessionKey');

            const sessionKeyExpire = new Date();
            sessionKeyExpire.setHours(sessionKeyExpire.getDate() + 1);

            reportProgress(4 / 4);
            return sessionKey;
        } finally {
            loginPromise = null;
        }
    });

    return loginPromise;
}
