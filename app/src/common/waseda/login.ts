import { InvalidResponseError, LoginError } from '../error';
import { assertCurrentContextType, postForm } from '../util/util';

assertCurrentContextType('background_script');

let loginPromise: Promise<string> | null = null;
export function login(userId: string, password: string): Promise<string> {
    if (loginPromise) {
        return loginPromise;
    }

    loginPromise = (async () => {
        try {
            const response = await fetch(
                'https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https://wsdmoodle.waseda.jp/&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off',
                { credentials: 'include', mode: 'cors' }
            );
            let page = new DOMParser().parseFromString(await response.text(), 'text/html');

            if (response.url !== 'https://wsdmoodle.waseda.jp/my/') {
                if (page.getElementsByTagName('script')[0]?.textContent?.startsWith('//<![CDATA[\n$Config={')) {
                    const strLoginParams = page.getElementsByTagName('script')[0]?.textContent?.slice(20, -7);
                    if (!strLoginParams) throw new InvalidResponseError('cannot find `$Config`');
                    const loginParams = JSON.parse(strLoginParams);

                    const loginRequestForm = {
                        i13: '0',
                        login: userId,
                        loginfmt: userId,
                        type: '11',
                        LoginOptions: '3',
                        lrt: '',
                        lrtPartition: '',
                        hisRegion: '',
                        hisScaleUnit: '',
                        passwd: password,
                        ps: '2',
                        psRNGCDefaultType: '',
                        psRNGCEntropy: '',
                        psRNGCSLK: '',
                        canary: loginParams.canary,
                        ctx: loginParams.sCtx,
                        hpgrequestid: loginParams.sessionId,
                        flowToken: loginParams.sFT,
                        PPSX: '',
                        NewUser: '1',
                        FoundMSAs: '',
                        fspost: '0',
                        i21: '0',
                        CookieDisclosure: '0',
                        IsFidoSupported: '0',
                        isSignupPost: '0',
                        i2: '1',
                        i17: '',
                        i18: '',
                        i19: '4829',
                    };

                    page = new DOMParser().parseFromString(
                        await (
                            await postForm(
                                'https://login.microsoftonline.com/b3865172-9887-4b3a-89ff-95a35b92f4c3/login',
                                loginRequestForm
                            )
                        ).text(),
                        'text/html'
                    );
                }

                if (
                    page.getElementsByTagName('form')[0]?.action ===
                    'https://iaidp.ia.waseda.jp/idp/profile/Authn/SAML2/POST/SSO'
                ) {
                    const requestForm1 = Object.fromEntries(
                        (Array.from(page.querySelectorAll('input[type=hidden]')) as HTMLInputElement[]).map(
                            ({ name, value }) => [name, value]
                        )
                    );
                    page = new DOMParser().parseFromString(
                        await (
                            await postForm('https://iaidp.ia.waseda.jp/idp/profile/Authn/SAML2/POST/SSO', requestForm1)
                        ).text(),
                        'text/html'
                    );
                }

                if (
                    page.getElementsByTagName('form')[0]?.action ===
                    'https://wsdmoodle.waseda.jp/auth/saml2/sp/saml2-acs.php/wsdmoodle.waseda.jp'
                ) {
                    const requestForm2 = Object.fromEntries(
                        (Array.from(page.querySelectorAll('input[type=hidden]')) as HTMLInputElement[]).map(
                            ({ name, value }) => [name, value]
                        )
                    );

                    page = new DOMParser().parseFromString(
                        await (
                            await postForm(
                                'https://wsdmoodle.waseda.jp/auth/saml2/sp/saml2-acs.php/wsdmoodle.waseda.jp',
                                requestForm2
                            )
                        ).text(),
                        'text/html'
                    );
                }
            }

            const sessionKey = page
                .querySelector('[data-title="logout,moodle"]')
                ?.getAttribute('href')
                ?.match(/sesskey=(.*)$/)?.[1];
            if (!sessionKey) throw new InvalidResponseError('cannot find sessionKey');

            const sessionKeyExpire = new Date();
            sessionKeyExpire.setHours(sessionKeyExpire.getDate() + 1);

            return sessionKey;
        } catch (error) {
            throw new LoginError(error);
        } finally {
            loginPromise = null;
        }
    })();

    return loginPromise;
}
