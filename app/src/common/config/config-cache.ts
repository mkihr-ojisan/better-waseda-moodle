// キャッシュして同期関数にしたgetConfig, setConfig, removeConfig

import { ConfigKey, ConfigValue, defaultValue, storage } from './config';

let cache: { [key: string]: any; } | undefined;

export async function initConfigCache(): Promise<void> {
    cache = await storage.get(undefined);

    browser.storage.onChanged.addListener(changes => {
        if (!cache) throw Error('cache is not initialized');

        for (const [key, { newValue }] of Object.entries(changes)) {
            cache[key] = newValue;
        }
    });
}
export function getConfigCache<T extends ConfigKey>(key: T): ConfigValue<T> {
    if (!cache) throw Error('cache is not initialized');

    return cache[key] ?? defaultValue[key];
}
export function setConfigCache<T extends ConfigKey>(key: T, value: ConfigValue<T>): void {
    if (!cache) throw Error('cache is not initialized');

    cache[key] = value;
    storage.set({ [key]: value });
}
export function removeConfigCache<T extends ConfigKey>(key: T): void {
    if (!cache) throw Error('cache is not initialized');

    delete cache[key];
    storage.remove([key]);
}