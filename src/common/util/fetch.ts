/**
 * Cookieを含めてfetchする
 *
 * @param input - URL
 * @param init - リクエストのオプション
 * @returns レスポンス
 */
export function fetchWithCredentials(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    return fetch(input, { credentials: "include", mode: "cors", ...init });
}

/**
 * Cookieを含めてHTMLをfetchし、パースする。
 *
 * @param input - URL
 * @param init - リクエストのオプション
 */
export async function fetchHTML(input: RequestInfo | URL, init: RequestInit = {}): Promise<Document> {
    const response = await fetchWithCredentials(input, init);
    if (!response.ok) {
        throw Error(`failed to fetch ${input}: ${response.status} ${response.statusText}`);
    }
    return new DOMParser().parseFromString(await response.text(), "text/html");
}

/**
 * Cookieを含めてJSONをfetchし、パースする。
 *
 * @param input - URL
 * @param init - リクエストのオプション
 */
export async function fetchJSON<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
    const response = await fetchWithCredentials(input, init);
    if (!response.ok) {
        throw Error(`failed to fetch ${input}: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

/**
 * Cookieを含めてJSONをpostし、レスポンスをパースする。
 *
 * @param input - URL
 * @param body - JSONに変換して送信するオブジェクト
 * @param init - リクエストのオプション
 * @returns レスポンス
 */
export function postJSON<T>(input: RequestInfo | URL, body: unknown, init: RequestInit = {}): Promise<T> {
    return fetchJSON(input, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        ...init,
    });
}

/**
 * Cookieを含めてフォームをpostする。
 *
 * @param input - URL
 * @param form - 送信するフォーム
 * @param init - リクエストのオプション
 * @returns レスポンス
 */
export function postForm(
    input: RequestInfo | URL,
    form: Record<string, string>,
    init: RequestInit = {}
): Promise<Response> {
    const body = Object.entries(form)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

    return fetchWithCredentials(input, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        ...init,
    });
}

/**
 * Cookieを含めてフォームをpostし、受け取ったHTMLをパースする。
 *
 * @param input - URL
 * @param form - 送信するフォーム
 * @param init - リクエストのオプション
 * @returns レスポンス
 */
export function postFormAndParse(
    input: RequestInfo | URL,
    form: Record<string, string>,
    init: RequestInit = {}
): Promise<Document> {
    const body = Object.entries(form)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
    return fetchHTML(input, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        ...init,
    });
}

/**
 * multipart/form-dataでフォームをpostする。
 *
 * @param input - URL
 * @param form - 送信するフォーム
 * @param init - リクエストのオプション
 * @returns レスポンス
 */
export function postMultipartFormData(
    input: RequestInfo | URL,
    form: [string, string][],
    init: RequestInit = {}
): Promise<Response> {
    const boundary = "----WebKitFormBoundary" + Math.random().toString(16).slice(2);

    let body = "";
    for (const [key, value] of form) {
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
        body += value + "\r\n";
    }
    body += boundary + "--";

    return fetchWithCredentials(input, {
        method: "POST",
        headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
        body,
        ...init,
    });
}
