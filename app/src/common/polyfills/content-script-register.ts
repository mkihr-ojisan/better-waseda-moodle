// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import matchPattern from 'match-pattern';

browser.contentScripts = {
    register: async (contentScriptOptions: browser.contentScripts.RegisteredContentScriptOptions, callback?: ((contentScript: browser.contentScripts.RegisteredContentScript) => void) | undefined): Promise<browser.contentScripts.RegisteredContentScript> => {
        if (contentScriptOptions.allFrames || contentScriptOptions.excludeGlobs || contentScriptOptions.excludeMatches || contentScriptOptions.includeGlobs || contentScriptOptions.matchAboutBlank) throw Error('used unsupported options');

        const listeners: ((tabId: number, changeInfo: browser.tabs._OnUpdatedChangeInfo, tab: browser.tabs.Tab) => void)[] = [];
        for (const match of contentScriptOptions.matches) {
            const pattern = matchPattern.parse(match);
            const listener = (tabId: number, changeInfo: browser.tabs._OnUpdatedChangeInfo, tab: browser.tabs.Tab) => {
                if ((
                    contentScriptOptions.runAt === 'document_start' && changeInfo.status === 'loading' ||
                    contentScriptOptions.runAt !== 'document_start' && changeInfo.status === 'complete'
                ) && pattern.test(tab.url)) {
                    for (const js of contentScriptOptions.js ?? []) {
                        browser.tabs.executeScript(tabId, {
                            ...js,
                            runAt: contentScriptOptions.runAt,
                        });
                    }
                    for (const css of contentScriptOptions.css ?? []) {
                        browser.tabs.insertCSS(tabId, {
                            ...css,
                            runAt: contentScriptOptions.runAt,
                        });
                    }
                }
            };
            browser.tabs.onUpdated.addListener(listener);
            listeners.push(listener);
        }

        const registeredContentScript = {
            unregister: async () => {
                listeners.forEach(browser.tabs.onUpdated.removeListener);
            }
        };
        callback?.(registeredContentScript);
        return registeredContentScript;
    }
};
