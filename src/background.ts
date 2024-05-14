import { initAutoLogin } from "./common/auto-login/background";
import { ConfigKey, getConfig, initConfig, setConfig } from "./common/config/config";
import { initMessengerServer } from "./common/util/messenger/server";
import { migrateConfig } from "./common/config/migration";
import { assertExtensionContext } from "./common/util/context";
import { initBlockXhrRequests } from "./block-xhr-requests/background";
import { initFixStyle } from "./fix-style/background";
import { fetchCourses } from "./common/course/course";
import { fetchSyllabus, searchOldSyllabus, searchSyllabus } from "./common/api/waseda/syllabus";
import { collectSyllabusInformation } from "./common/course/collect-syllabus-information";
import { getCourseColor } from "./common/course/course-color";
import { fetchUserProfile } from "./common/api/moodle/user-profile";
import { getConstants } from "./common/constants/constants";
import { initRemoveLoadingVideo } from "./remove-loading-video/background";
import { initViewInBrowser } from "./view-in-browser/background";
import { initCheckNotesOnSubmitting } from "./check-notes-on-submitting/background";
import { initFixPortalLink } from "./fix-portal-link/background";
import { initFixSyllabusLink } from "./fix-syllabus-link/background";
import { core_calendar_get_action_events_by_timesort } from "./common/api/moodle/calendar";
import { initTimeline } from "./popup/background";
import { initAutoSessionExtension } from "./auto-session-extension/background";
import { initLauncher } from "./launcher/background";
import { initAssignmentFilename } from "./assignment-filename/background";
import { DayOfWeek, Term, getTimetableData, setTimetableData } from "./common/course/timetable";
import { callMoodleMobileAPI, getWebServiceToken } from "./common/api/moodle/mobileAPI";
import { initBlockTracking } from "./block-tracking/background";
import { initMoreVisibleRemainingTime } from "./quiz/more-visible-remaining-time/background";
import { initWordCounter } from "./word-counter/background";
import { fetchMoodleTimeline } from "./common/timeline/timeline";
import { initDisableUnloadEvent } from "./faster-back-and-forward/background";

// #!if VENDOR === "chrome"
import "@/common/polyfills/DOMParser";
// #!endif

assertExtensionContext("background");

(async () => {
    const initPromise = (async () => {
        await migrateConfig();
        await initConfig();
    })();

    // browser.runtime.onMessage.addListenerは同期的に呼び出される必要がある
    initMessengerServer(initPromise);
    // browser.runtime.onInstalled.addListener、browser.contextMenus.onClicked.addListenerも同期的に呼び出される必要がある
    initLauncher();
    // ブラウザ起動時に拡張機能のバックグラウンドスクリプトを読み込んでほしい
    browser.runtime.onStartup.addListener(() => undefined);

    await initPromise;

    initAutoLogin();
    initBlockXhrRequests();
    initFixStyle();
    initRemoveLoadingVideo();
    initViewInBrowser();
    initCheckNotesOnSubmitting();
    initFixPortalLink();
    initFixSyllabusLink();
    initTimeline();
    initAutoSessionExtension();
    initAssignmentFilename();
    initBlockTracking();
    initMoreVisibleRemainingTime();
    initWordCounter();
    initDisableUnloadEvent();

    if (process.env.NODE_ENV === "development") {
        debug();
    }
})();

/**
 * デバッグ用にグローバル変数を定義する
 */
function debug() {
    Object.assign(globalThis, {
        getConfig,
        setConfig,
        ConfigKey,
        fetchCourses,
        fetchUserProfile,
        searchSyllabus,
        searchOldSyllabus,
        fetchSyllabus,
        collectSyllabusInformation,
        getCourseColor,
        getConstants,
        core_calendar_get_action_events_by_timesort,
        Term,
        DayOfWeek,
        getTimetableData,
        setTimetableData,
        getWebServiceToken,
        callMoodleMobileAPI,
        fetchMoodleTimeline,
    });
}
