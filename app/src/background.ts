import { initAutoLogin } from './autoLogin/autoLogin';
import { initConfigCache } from './config/configCache';
import { MessengerServer } from './util/messenger';
import { initRemoveLoadingVideo } from './video/removeLoadingVideo/removeLoadingVideo';
import { initViewInBrowser } from './others/viewInBrowser/viewInBrowser';

export const messengerServer = new MessengerServer();

(async () => {
    await initConfigCache();
    initAutoLogin();
    initRemoveLoadingVideo();
    initViewInBrowser();
})();