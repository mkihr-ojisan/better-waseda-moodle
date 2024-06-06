import { errorToString } from "./error";

export type ErrorLogEntry = {
    message: string;
    name?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
    timestamp: number;
    page: string;
};

/**
 * エラーをログに記録する
 *
 * @param message - エラーメッセージ
 * @param name - エラー名
 * @param filename - エラーが発生したファイル名
 * @param lineno - エラーが発生した行番号
 * @param colno - エラーが発生した列番号
 * @param stack - スタックトレース
 * @param timestamp - エラーが発生した時刻。省略した場合は現在時刻
 * @param page - エラーが発生したページのURL。省略した場合は現在のページ
 */
export async function logError(
    message: string,
    name?: string,
    filename?: string,
    lineno?: number,
    colno?: number,
    stack?: string,
    timestamp?: number,
    page?: string
): Promise<void> {
    const errors = ((await browser.storage.local.get("errors")).errors as ErrorLogEntry[]) ?? [];
    if (errors.length >= 100) {
        errors.shift();
    }
    errors.push({
        message,
        name,
        filename,
        lineno,
        colno,
        stack,
        timestamp: timestamp ?? Date.now(),
        page: page ?? location.href,
    });
    await browser.storage.local.set({ errors });
}

self.addEventListener("error", (event) => {
    if (event.filename.startsWith("https://")) return;

    if (event.error instanceof Error) {
        logError(event.error.message, event.error.name, event.filename, event.lineno, event.colno, event.error.stack);
    } else {
        logError(errorToString(event.error), undefined, event.filename, event.lineno, event.colno);
    }
});

declare global {
    interface Error {
        fileName?: string;
        lineNumber?: number;
        columnNumber?: number;
    }
}

self.addEventListener("unhandledrejection", (event) => {
    if (event.reason instanceof Error) {
        if (event.reason.fileName?.startsWith("https://")) return;

        logError(
            event.reason.message,
            event.reason.name,
            event.reason.fileName,
            event.reason.lineNumber,
            event.reason.columnNumber,
            event.reason.stack
        );
    } else {
        logError(errorToString(event.reason));
    }
});

/**
 * エラーログを取得する
 */
export async function getErrorLog(): Promise<ErrorLogEntry[]> {
    return ((await browser.storage.local.get("errors")).errors as ErrorLogEntry[]) ?? [];
}

/**
 * エラーログをクリアする
 */
export async function clearErrorLog(): Promise<void> {
    await browser.storage.local.remove("errors");
}
