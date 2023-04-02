export class BWMError extends Error {
    innerError?: unknown;

    constructor(message: string, innerError?: unknown) {
        let innerErrorMessage;
        if (!innerError) {
            innerErrorMessage = "";
        } else if (innerError instanceof BWMError) {
            innerErrorMessage = innerError.message;
        } else if (innerError instanceof Error) {
            innerErrorMessage = `${browser.i18n.getMessage("error_unknown")} (${innerError.message})`;
        } else {
            innerErrorMessage = String(innerError);
        }
        super(message + (innerErrorMessage ? ": " + innerErrorMessage : ""));
        this.innerError = innerError;
    }
}

export class InvalidResponseError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage("error_invalid_response"), innerError);
    }
}

export class LoginError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage("error_login"), innerError);
    }
}

export class LoginRequiredError extends BWMError {
    constructor(innerError?: unknown) {
        super(browser.i18n.getMessage("error_login_required"), innerError);
    }
}

/**
 * エラーを文字列に変換する
 *
 * @param error - エラー
 * @returns 文字列
 */
export function errorToString(error: unknown): string {
    if (error instanceof BWMError) {
        return error.message;
    } else if (error instanceof Error) {
        return browser.i18n.getMessage("error_unknown", error.message);
    } else {
        return browser.i18n.getMessage("error_unknown", String(error));
    }
}

/**
 * エラーをシリアライズする
 *
 * @param error - エラー
 * @returns シリアライズされたエラー
 */
export function serializeError(error: unknown): string {
    return JSON.stringify({
        message: errorToString(error),
    });
}

/**
 * シリアライズされたエラーをデシリアライズする
 *
 * @param error - シリアライズされたエラー
 * @returns エラー
 */
export function deserializeError(error: string): BWMError {
    const { message } = JSON.parse(error);
    return new BWMError(message);
}
