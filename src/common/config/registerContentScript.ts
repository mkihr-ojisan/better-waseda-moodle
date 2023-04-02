import { ConfigKey, addOnConfigChangeListener } from "./config";

/**
 * configの値に応じてコンテンツスクリプトの登録・解除を行う。
 *
 * @param configKeys - configのキー
 * @param contentScriptOptions - 登録するコンテンツスクリプト
 */
export default function registerContentScript(
    configKeys: ConfigKey | ConfigKey[],
    contentScriptOptions: browser.contentScripts.RegisteredContentScriptOptions
): void {
    let registeredContentScript: Promise<browser.contentScripts.RegisteredContentScript> | null = null;

    if (!(configKeys instanceof Array)) {
        configKeys = [configKeys];
    }

    const values: Record<string, any> = Object.fromEntries(configKeys.map((k) => [k, undefined]));

    for (const key of configKeys) {
        addOnConfigChangeListener(
            key,
            (newValue: any) => {
                values[key] = newValue;

                if (Object.values(values).every((v) => !!v)) {
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
}
