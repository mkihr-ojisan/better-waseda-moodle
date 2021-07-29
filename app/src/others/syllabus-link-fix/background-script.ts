import { registerContentScript } from '../../common/config/content-script-registry';

export function initSyllabusLinkFix(): void {
    registerContentScript('syllabusLinkFix.enabled', {
        matches: ['https://www.wsl.waseda.jp/syllabus/JAA101.php*', 'https://www.wsl.waseda.jp/syllabus/index.php*'],
        js: [{ file: 'src/others/syllabus-link-fix/content-script.js' }],
        runAt: 'document_idle',
    });
}
