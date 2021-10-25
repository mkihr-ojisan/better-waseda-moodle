import registerContentScript from '../../common/config/registerContentScript';

export function initCheckSession(): void {
    registerContentScript(['checkSession.enabled', 'checkSession.quiz'], {
        matches: ['https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*'],
        js: [{ file: 'src/others/check-session/content-script.js' }],
        runAt: 'document_idle',
    });
    registerContentScript(['checkSession.enabled', 'checkSession.assignment'], {
        matches: ['https://wsdmoodle.waseda.jp/mod/assign/view.php*'],
        js: [{ file: 'src/others/check-session/content-script.js' }],
        runAt: 'document_idle',
    });
    registerContentScript(['checkSession.enabled', 'checkSession.forum'], {
        matches: ['https://wsdmoodle.waseda.jp/mod/forum/*'],
        js: [{ file: 'src/others/check-session/content-script.js' }],
        runAt: 'document_idle',
    });
}
