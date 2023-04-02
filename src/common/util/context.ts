export type ExtensionContext = "background" | "content_script" | "extension_page";

/**
 * 現在のコンテキストを取得する
 *
 * @returns 現在のコンテキスト
 */
export function getCurrentExtensionContext(): ExtensionContext {
    if (location.pathname === "/_generated_background_page.html") {
        return "background";
    } else if ("cookies" in browser) {
        return "extension_page";
    } else {
        return "content_script";
    }
}

/**
 * 現在のコンテキストが指定されたコンテキストであることを確認する
 *
 * @param context - 許可されたコンテキストまたはコンテキストの配列
 */
export function assertExtensionContext(context: ExtensionContext | ExtensionContext[]): void {
    const currentContext = getCurrentExtensionContext();

    if (Array.isArray(context)) {
        if (!context.includes(currentContext)) {
            throw Error(`context must be one of [${context.join(", ")}], but ${currentContext}`);
        }
    } else if (currentContext !== context) {
        throw new Error(`context must be ${context}, but ${currentContext}`);
    }
}
