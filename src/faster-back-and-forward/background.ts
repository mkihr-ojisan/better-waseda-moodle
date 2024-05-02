import { ConfigKey, addOnConfigChangeListener } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * unloadイベントを無効化する機能を初期化します。
 */
export function initDisableUnloadEvent(): void {
    registerContentScript(ConfigKey.FasterBackAndForward, {
        matches: ["https://wsdmoodle.waseda.jp/*"],
        js: [{ file: "/faster-back-and-forward/content.js" }],
        runAt: "document_start",
    });

    const listener = (
        details: browser.webRequest._OnHeadersReceivedDetails
    ): browser.webRequest.BlockingResponse | undefined => {
        const headers = details.responseHeaders;
        if (!headers) return;

        for (const header of headers) {
            if (header.name.toLowerCase() === "cache-control" && header.value?.includes("no-store")) {
                const directives = header.value
                    .split(",")
                    .map((d) => d.trim())
                    .filter((d) => d !== "no-store");
                directives.push("private");
                directives.push("no-cache");
                directives.push("max-age=0");
                directives.push("must-revalidate");
                header.value = directives.join(", ");
            }
        }

        return { responseHeaders: headers };
    };

    addOnConfigChangeListener(ConfigKey.FasterBackAndForward, (value) => {
        if (value) {
            browser.webRequest.onHeadersReceived.addListener(listener, { urls: ["https://wsdmoodle.waseda.jp/*"] }, [
                "blocking",
                "responseHeaders",
            ]);
        } else {
            browser.webRequest.onHeadersReceived.removeListener(listener);
        }
    });
}
