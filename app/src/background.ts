// #!blink_only
import './common/polyfills/content-script-register';

import { initAutoLogin } from './auto-login/auto-login';
import { MessengerServer } from './common/util/messenger';
import { initRemoveLoadingVideo } from './others/remove-loading-video/remove-loading-video';
import { initViewInBrowser } from './others/view-in-browser/view-in-browser';
import { initMoreVisibleRemainingTime } from './quiz/more-visible-remaining-time/more-visible-remaining-time';
import { initCourseOverview } from './course-overview/background-script';
import { initDisableRateLimit } from './others/disable-rate-limit/disable-rate-limit';
import { initHideName } from './others/hide-name/background-script';
import { initSyllabusLinkFix } from './others/syllabus-link-fix/background-script';
import { assertCurrentContextType } from './common/util/util';
import './common/waseda/course/course-list';
import './common/waseda/course/course-registration';
import { initRemindUnansweredQuestions } from './quiz/remind-unanswered-questions/background-script';
import { initCheckSession } from './others/check-session/background-script';
import { enableConfigSyncIfFirstRun, initConfigCache } from './common/config/config';
import { initCheckNotesOnSubmitting } from './others/check-notes-on-submitting/background-script';
import './options-page/background-script';
import './common/waseda/calendar';
import { initToDoList } from './common/todo-list/background-script';

assertCurrentContextType('background_script');

MessengerServer.init();

(async () => {
    await initConfigCache();
    await enableConfigSyncIfFirstRun();

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
    initCheckNotesOnSubmitting();
    initToDoList();
})();
