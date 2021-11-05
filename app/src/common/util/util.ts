import copy from 'fast-copy';
import { BWMError } from '../error';
import { DeepReadonly } from './types';

export async function fetchHtml(url: string, init: RequestInit = {}): Promise<Document> {
    Object.assign(init, { credentials: 'include', mode: 'cors' });
    return new DOMParser().parseFromString(await (await fetch(url, init)).text(), 'text/html');
}
export async function fetchJson(url: string, init: RequestInit = {}): Promise<any> {
    Object.assign(init, { credentials: 'include', mode: 'cors' });
    return JSON.parse(await (await fetch(url, init)).text());
}

export async function postJson<T>(url: string, body: T, init: RequestInit = {}): Promise<any> {
    Object.assign(init, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
        mode: 'cors',
    });
    return await (await fetch(url, init)).json();
}
export async function postForm(url: string, form: Record<string, string>, init: RequestInit = {}): Promise<Response> {
    Object.assign(init, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: Object.entries(form)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&'),
    });
    return await fetch(url, init);
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function range(start: number, endExclusive: number, step = 1): number[] {
    return Array.from({ length: Math.ceil((endExclusive - start) / step) }, (_, k) => start + step * k);
}

export type ContextType = 'background_script' | 'extension_page' | 'content_script';
let currentContextType: ContextType | undefined;
export function getCurrentContextType(): ContextType {
    if (currentContextType) {
        return currentContextType;
    } else if (location.href === browser.runtime.getURL('_generated_background_page.html')) {
        return (currentContextType = 'background_script');
    } else if (browser.webRequest) {
        return (currentContextType = 'extension_page');
    } else {
        return (currentContextType = 'content_script');
    }
}

export function assertCurrentContextType(type: ContextType): void {
    if (process.env.NODE_ENV === 'development' && type !== getCurrentContextType()) {
        throw Error(`assertion failed: current context must be '${type}', but it is '${getCurrentContextType()}'`);
    }
}

export function clone<T, S extends DeepReadonly<T>>(obj: S): T {
    return copy(obj) as T;
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof BWMError) {
        return browser.i18n.getMessage('errorOccurred', error.message);
    } else if (error instanceof Error) {
        return browser.i18n.getMessage('errorOccurred', browser.i18n.getMessage('unknownError', error.message));
    } else {
        return browser.i18n.getMessage('errorOccurred', String(error));
    }
}
