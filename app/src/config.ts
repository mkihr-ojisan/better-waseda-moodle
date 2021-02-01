const storage = browser.storage.local;

export async function getConfig<T>(key: string): Promise<T> {
    return await storage.get(key) as T;
}
export async function setConfig<T>(key: string, value: T): Promise<void> {
    await storage.set({ [key]: value });
}
export async function removeConfig(key: string): Promise<void> {
    await storage.remove(key);
}