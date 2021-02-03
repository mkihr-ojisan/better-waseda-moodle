// background scriptでだけ使う

import { messengerServer } from './background';

const storage = browser.storage.local;
let cache: { [key: string]: any; } = {};

export async function initConfig(): Promise<void> {
    cache = await storage.get(undefined);

    messengerServer.addInstruction('getConfig', getConfig);
    messengerServer.addInstruction('setConfig', setConfig);
    messengerServer.addInstruction('removeConfig', removeConfig);
}

export function getConfig<T>(key: string): T | undefined {
    return cache[key];
}
export function setConfig<T>(key: string, value: T): void {
    cache[key] = value;
    storage.set({ [key]: value });
}
export function removeConfig(key: string): void {
    delete cache[key];
    storage.remove(key);
}

export const AUTO_LOGIN_ENABLED = 'autoLogin.enabled';
export const AUTO_LOGIN_ID = 'autoLogin.loginId';
export const AUTO_LOGIN_PASSWORD = 'autoLogin.password';
