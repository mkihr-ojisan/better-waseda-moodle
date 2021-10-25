import registerContentScript from '../../common/config/registerContentScript';

export function initMoreVisibleRemainingTime(): void {
    registerContentScript('moreVisibleRemainingTime.enabled', {
        matches: ['https://wsdmoodle.waseda.jp/mod/quiz/attempt.php*'],
        css: [{ file: 'src/quiz/more-visible-remaining-time/style.css' }],
    });
}
