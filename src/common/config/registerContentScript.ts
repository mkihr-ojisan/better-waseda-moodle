import { ConfigKey, addOnConfigChangeListener } from "./config";

/**
 * configの値に応じてコンテンツスクリプトの登録・解除を行う。
 *
 * @param configKeys - configのキー
 * @param scripts - 登録するコンテンツスクリプト
 */
export default function registerContentScript(
    configKeys: ConfigKey | ConfigKey[],
    scripts: browser.scripting.RegisteredContentScript[]
): void {
    let registerPromise: Promise<void> | null = null;

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
                    if (!registerPromise)
                        registerPromise = (async () => {
                            try {
                                await browser.scripting.registerContentScripts(
                                    scripts.map((s) => ({ ...s, persistAcrossSessions: false }))
                                );
                            } catch (e) {
                                // 同じidで登録しようとするとエラーになるので無視
                            }
                        })();
                } else {
                    registerPromise?.then(() => {
                        browser.scripting.unregisterContentScripts({ ids: scripts.map((s) => s.id) });
                        registerPromise = null;
                    });
                }
            },
            true
        );
    }
}
