import { logout } from '../../autoLogin/autoLogin';
import { fetchHtml } from '../util/util';

let loginPromise: Promise<string> | null = null;
export async function login(userId: string, password: string): Promise<string> {
    if (loginPromise) {
        return await loginPromise;
    }

    loginPromise = (async () => {
        try {
            await logout();

            const loginPage = await fetchHtml('https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off');

            const loginInfoPostUrl = loginPage.getElementById('login')?.getAttribute('action');
            if (!loginInfoPostUrl) throw Error('cannot find loginInfoPostUrl');

            const loginInfoPostUrlFull = new URL(loginInfoPostUrl, 'https://iaidp.ia.waseda.jp/');

            const csrfToken = loginPage.querySelector('input[name="csrf_token"]')?.getAttribute('value');
            if (!csrfToken) throw Error('cannot find csrfToken');

            if (!userId || !password) throw Error('userId or password is not set');

            const loginResponse = await fetchHtml(loginInfoPostUrlFull.href, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: `csrf_token=${csrfToken}&j_username=${encodeURIComponent(userId)}&j_password=${encodeURIComponent(password)}&_eventId_proceed=Login`,
            });

            const RelayState = loginResponse.querySelector('input[name="RelayState"]')?.getAttribute('value');
            if (!RelayState) throw Error('cannot find RelayState');
            const SAMLResponse = loginResponse.querySelector('input[name="SAMLResponse"]')?.getAttribute('value');
            if (!SAMLResponse) throw Error('cannot find SAMLResponse');

            const moodleTopPostUrl = loginResponse.getElementsByTagName('form')[0]?.getAttribute('action');
            if (!moodleTopPostUrl) throw Error('moodleTopPostUrl');
            const moodleTop = await fetchHtml(moodleTopPostUrl, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: `RelayState=${encodeURIComponent(RelayState)}&SAMLResponse=${encodeURIComponent(SAMLResponse)}`,
            });

            const sessionKey = moodleTop.querySelector('[data-title="logout,moodle"]')?.getAttribute('href')?.match(/sesskey=(.*)$/)?.[1];
            if (!sessionKey) throw Error('cannot find sessionKey');

            const sessionKeyExpire = new Date();
            sessionKeyExpire.setHours(sessionKeyExpire.getDate() + 1);

            return sessionKey;
        } finally {
            loginPromise = null;
        }
    })();

    return await loginPromise;
}
