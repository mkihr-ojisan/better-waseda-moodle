import { ConfigKey, onConfigChange } from './config';

export function registerContentScript(
    configKey: ConfigKey,
    contentScriptOptions: browser.contentScripts.RegisteredContentScriptOptions
): void {
    let registeredContentScript: Promise<browser.contentScripts.RegisteredContentScript> | null = null;
    onConfigChange(
        configKey,
        (_, newValue) => {
            if (newValue) {
                if (!registeredContentScript)
                    registeredContentScript = browser.contentScripts.register(contentScriptOptions);
            } else {
                registeredContentScript?.then((r) => {
                    r.unregister();
                    registeredContentScript = null;
                });
            }
        },
        true
    );
}
