import defaultValue from './defaultValue';

export const storage = browser.storage.local;
const listeners: { [key: string]: ((oldValue: any | undefined, newValue: any | undefined) => void)[]; } = {};

export async function getConfig<T>(key: string): Promise<T> {
    return (await storage.get([key]))[key] ?? defaultValue[key];
}
export async function setConfig<T>(key: string, value: T): Promise<void> {
    await storage.set({ [key]: value });
}
export async function removeConfig(key: string): Promise<void> {
    await storage.remove([key]);
}

export async function onConfigChange<T>(key: string, listener: (oldValue: T | undefined, newValue: T) => void, initCall: boolean): Promise<void> {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(listener);
    if (initCall) listener(undefined, await getConfig(key));

    if (!browser.storage.onChanged.hasListener(storageChangeListener)) {
        browser.storage.onChanged.addListener(storageChangeListener);
    }
}

function storageChangeListener(changes: Record<string, browser.storage.StorageChange>): void {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        listeners[key]?.forEach(listener => listener(oldValue, newValue ?? defaultValue[key]));
    }
}