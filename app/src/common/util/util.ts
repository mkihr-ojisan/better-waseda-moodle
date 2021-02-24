export async function fetchHtml(url: string, init: RequestInit = {}): Promise<Document> {
    Object.assign(init, { credentials: 'include', mode: 'cors' });
    return new DOMParser().parseFromString(await (await fetch(url, init)).text(), 'text/html');
}
export async function fetchJson(url: string, init: RequestInit = {}): Promise<any> {
    Object.assign(init, { credentials: 'include', mode: 'cors' });
    return JSON.parse(await (await fetch(url, init)).text());
}

export async function postJson(url: string, body: any, init: RequestInit = {}): Promise<any> {
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
        body: Object.entries(form).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&'),
    });
    return await fetch(url, init);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export type Vendor = 'firefox' | 'chrome' | 'opera' | 'edge';
declare const __VENDOR__: Vendor;
export const VENDOR = __VENDOR__;