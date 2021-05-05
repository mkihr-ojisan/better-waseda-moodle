import { initAutoLogin, doLogin, logout } from './auto-login/auto-login';
import { initConfigCache } from './common/config/config-cache';
import { MessengerServer } from './common/util/messenger';
import { initRemoveLoadingVideo } from './others/remove-loading-video/remove-loading-video';
import { initViewInBrowser } from './others/view-in-browser/view-in-browser';
import { initMoreVisibleRemainingTime } from './others/more-visible-remaining-time/more-visible-remaining-time';
import { initCourseOverview } from './course-overview/background-script';
import { fetchCourseList, setHiddenFromCourseList } from './common/waseda/course/course-list';
import { initDisableRateLimit } from './others/disable-rate-limit/disable-rate-limit';
import { initHideName } from './others/hide-name/background-script';
import { initSyllabusLinkFix } from './others/syllabus-link-fix/background-script';
import { enableConfigSyncIfFirstRun } from './common/config/sync';

// #!blink_only
import './common/polyfills/content-script-register';

const messengerServer = new MessengerServer();
messengerServer.instructions = {
    fetchCourseList,
    setHiddenFromCourseList,
    doLogin,
    logout,
};

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
})();