import registerContentScript from '../../common/config/registerContentScript';

export function initCheckNotesOnSubmitting(): void {
    registerContentScript('checkNotesOnSubmitting.enabled', {
        matches: ['https://wsdmoodle.waseda.jp/mod/assign/view.php?*'],
        js: [{ file: 'src/others/check-notes-on-submitting/content-script.js' }],
    });
}
