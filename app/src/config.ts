const storage = browser.storage.local;

export async function getConfig<T>(key: string): Promise<T | undefined> {
    return (await storage.get(key))[key] as T | undefined;
}
export async function setConfig<T>(key: string, value: T): Promise<void> {
    await storage.set({ [key]: value });
}
export async function removeConfig(key: string): Promise<void> {
    await storage.remove(key);
}

export const AUTO_LOGIN_ENABLED = 'autoLogin.enabled';
export const AUTO_LOGIN_ID = 'autoLogin.loginId';
export const AUTO_LOGIN_PASSWORD = 'autoLogin.password';
