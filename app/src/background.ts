import { initAutoLogin } from './autoLogin/autoLogin';
import { initConfig } from './config';
import { MessengerServer } from './messenger';

export const messengerServer = new MessengerServer();

(async () => {
    await initConfig();
    initAutoLogin();
})();