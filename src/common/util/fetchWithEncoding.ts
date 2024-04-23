import { ConvertArrayOptions, convert } from "encoding-japanese";
import { fetchHTML } from "./fetch";

/**
 * Cookieを含めてフォームをpostし、受け取ったHTMLをパースする。
 *
 * @param input - URL
 * @param form - 送信するフォーム
 * @param init - リクエストのオプション
 * @param encoding - エンコーディング(デフォルトはUTF-8)
 * @returns レスポンス
 */
export function postFormWithEncodingAndParse(
    input: RequestInfo | URL,
    form: Record<string, string>,
    init: RequestInit = {},
    encoding: string
): Promise<Document> {
    const body = Object.entries(form)
        .map(
            ([key, value]) =>
                `${key}=${convert(value, { to: encoding, type: "array" } as ConvertArrayOptions)
                    .map((x) => `%${x.toString(16).toUpperCase()}`)
                    .join("")}`
        )
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
