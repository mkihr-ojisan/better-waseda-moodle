import { initAutoLogin } from './autoLogin/autoLogin';
import { initConfigCache } from './config/configCache';
import { MessengerServer } from './messenger';
import { initRemoveLoadingVideo } from './removeLoadingVideo/removeLoadingVideo';

export const messengerServer = new MessengerServer();

(async () => {
    await initConfigCache();
    initAutoLogin();
    initRemoveLoadingVideo();
})();