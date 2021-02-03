// background scriptでだけ使う

import { messengerServer } from './background';

const storage = browser.storage.local;
let cache: { [key: string]: any; } = {};
const listeners: { [key: string]: Function[]; } = {};

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
    if (cache[key] !== value) {
        listeners[key]?.forEach(listener => listener(cache[key], value));
        cache[key] = value;
        storage.set({ [key]: value });
    }
}
export function removeConfig(key: string): void {
    if (key in cache) {
        listeners[key]?.forEach(listener => listener(cache[key], undefined));
        delete cache[key];
        storage.remove(key);
    }
}

export function onConfigChange<T>(key: string, listener: (oldValue: T | undefined, newValue: T | undefined) => void, initCall: boolean): void {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(listener);
    if (initCall) listener(undefined, getConfig(key));
}

export const AUTO_LOGIN_ENABLED = 'autoLogin.enabled';
export const AUTO_LOGIN_ID = 'autoLogin.loginId';
export const AUTO_LOGIN_PASSWORD = 'autoLogin.password';
