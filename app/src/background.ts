import { initAutoLogin } from './autoLogin/autoLogin';
import { initConfig } from './config';
import { MessengerServer } from './messenger';
import { initRemoveLoadingVideo } from './removeLoadingVideo/removeLoadingVideo';

export const messengerServer = new MessengerServer();

(async () => {
    await initConfig();
    initAutoLogin();
    initRemoveLoadingVideo();
})();