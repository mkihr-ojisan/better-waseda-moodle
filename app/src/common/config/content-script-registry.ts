import { ConfigKey, onConfigChange } from './config';

export function registerContentScript(
    configKeys: ConfigKey | ConfigKey[],
    contentScriptOptions: browser.contentScripts.RegisteredContentScriptOptions
): void {
    let registeredContentScript: Promise<browser.contentScripts.RegisteredContentScript> | null = null;

    if (!(configKeys instanceof Array)) {
        configKeys = [configKeys];
    }

    const values = Object.fromEntries(configKeys.map((k) => [k, undefined]));

    const listener = (_: any, newValue: any, key: ConfigKey) => {
        values[key] = newValue;

        if (Object.values(values).every((v) => v === true)) {
            if (!registeredContentScript)
                registeredContentScript = browser.contentScripts.register(contentScriptOptions);
        } else {
            registeredContentScript?.then((r) => {
                r.unregister();
                registeredContentScript = null;
            });
        }
    };

    for (const key of configKeys) {
        onConfigChange(key, listener, true);
    }
}
