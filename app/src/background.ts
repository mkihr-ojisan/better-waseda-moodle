import { initAutoLogin } from './autoLogin/autoLogin';
import { initConfigCache } from './common/config/configCache';
import { MessengerServer } from './common/util/messenger';
import { initRemoveLoadingVideo } from './video/removeLoadingVideo/removeLoadingVideo';
import { initViewInBrowser } from './others/viewInBrowser/viewInBrowser';
import { initMoreVisibleRemainingTime } from './quiz/moreVisibleRemainingTime/moreVisibleRemainingTime';
// #!blink_only
import './common/polyfills/content-script-register';

export const messengerServer = new MessengerServer();

(async () => {
    await initConfigCache();
    initAutoLogin();
    initRemoveLoadingVideo();
    initViewInBrowser();
    initMoreVisibleRemainingTime();
})();