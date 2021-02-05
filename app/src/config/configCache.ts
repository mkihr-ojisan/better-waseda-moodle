// キャッシュして同期関数にしたgetConfig, setConfig, removeConfig

import { storage } from './config';
import defaultValue from './defaultValue';

let cache: { [key: string]: any; } | undefined;

export async function initConfigCache(): Promise<void> {
    if (!cache) throw Error('cache is not initialized');

    cache = await storage.get(undefined);

    browser.storage.onChanged.addListener(changes => {
        if (!cache) throw Error('cache is not initialized');

        for (const [key, { newValue }] of Object.entries(changes)) {
            cache[key] = newValue;
        }
    });
}
export function getConfigCache<T>(key: string): T {
    if (!cache) throw Error('cache is not initialized');

    return cache[key] ?? defaultValue[key];
}
export function setConfigCache<T>(key: string, value: T): void {
    if (!cache) throw Error('cache is not initialized');

    cache[key] = value;
    storage.set({ [key]: value });
}
export function removeConfigCache(key: string): void {
    if (!cache) throw Error('cache is not initialized');

    delete cache[key];
    storage.remove([key]);
}