// キャッシュして同期関数にしたgetConfig, setConfig, removeConfig

import { InternalError } from '../error';
import { assertCurrentContextType } from '../util/util';
import { ConfigKey, ConfigValue, defaultValue, getStorage } from './config';

assertCurrentContextType('background_script');

let cache: { [key: string]: any } | undefined;

export async function initConfigCache(): Promise<void> {
    cache = await (await getStorage()).get(undefined);

    browser.storage.onChanged.addListener((changes) => {
        if (!cache) throw new InternalError('cache is not initialized');

        for (const [key, { newValue }] of Object.entries(changes)) {
            cache[key] = newValue;
        }
    });
}
export function getConfigCache<T extends ConfigKey>(key: T): ConfigValue<T> {
    if (!cache) throw new InternalError('cache is not initialized');

    return cache[key] ?? defaultValue[key];
}
export function setConfigCache<T extends ConfigKey>(key: T, value: ConfigValue<T>): void {
    if (!cache) throw new InternalError('cache is not initialized');

    cache[key] = value;
    (async () => (await getStorage()).set({ [key]: value }))();
}
export function removeConfigCache<T extends ConfigKey>(key: T): void {
    if (!cache) throw new InternalError('cache is not initialized');

    delete cache[key];
    (async () => (await getStorage()).remove([key]))();
}
