import { initAutoLogin } from './auto-login/auto-login';
import { initConfigCache } from './common/config/config-cache';
import { MessengerServer } from './common/util/messenger';
import { initRemoveLoadingVideo } from './others/remove-loading-video/remove-loading-video';
import { initViewInBrowser } from './others/view-in-browser/view-in-browser';
import { initMoreVisibleRemainingTime } from './quiz/more-visible-remaining-time/more-visible-remaining-time';
import { initCourseOverview } from './course-overview/background-script';
import { initDisableRateLimit } from './others/disable-rate-limit/disable-rate-limit';
import { initHideName } from './others/hide-name/background-script';
import { initSyllabusLinkFix } from './others/syllabus-link-fix/background-script';
import { enableConfigSyncIfFirstRun } from './common/config/sync';
import { assertCurrentContextType } from './common/util/util';
import './common/waseda/course/course-list';

// #!blink_only
import './common/polyfills/content-script-register';
import { initRemindUnansweredQuestions } from './quiz/remind-unanswered-questions/background-script';
import { initCheckSession } from './others/check-session/background-script';

assertCurrentContextType('background_script');

MessengerServer.init();

(async () => {
    await enableConfigSyncIfFirstRun();

    await initConfigCache();
    initAutoLogin();
    initRemoveLoadingVideo();
    initViewInBrowser();
    initMoreVisibleRemainingTime();
    initCourseOverview();
    initDisableRateLimit();
    initHideName();
    initSyllabusLinkFix();
    initRemindUnansweredQuestions();
    initCheckSession();
})();
