import { initAutoLogin } from './autoLogin/autoLogin';
import { MessengerServer } from './messenger';

export const messengerServer = new MessengerServer();

initAutoLogin();