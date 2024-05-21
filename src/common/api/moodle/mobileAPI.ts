import { limitRate } from "@/common/util/limit-rate";
import md5 from "md5";
import { MoodleRequest } from "./moodle";
import { ensureLogin } from "@/common/auto-login/auto-login";
import { getWebServiceTokenFromQRCode } from "./qrlogin/qrlogin";

/**
 * Moodle Mobile App用のAPIトークンを取得する
 */
export async function getWebServiceToken(): Promise<string> {
    await ensureLogin();

    if (process.env.VENDOR === "firefox") {
        // FirefoxではWebRequestを使ってリダイレクト先のURLを取得できる

        const passport = Math.random() * 1000;
        const url = `https://wsdmoodle.waseda.jp/admin/tool/mobile/launch.php?service=moodle_mobile_app&passport=${passport}&urlscheme=moodlemobile`;

        const redirectUrlPromise = new Promise<string>((resolve, reject) => {
            const listener = (details: browser.webRequest._OnHeadersReceivedDetails) => {
                browser.webRequest.onHeadersReceived.removeListener(listener);

                const location = details.responseHeaders?.find((header) => header.name.toLowerCase() === "location");
                if (!location || !location.value) {
                    reject(new Error("No location header"));
                    return;
                }
                resolve(location.value);
            };

            browser.webRequest.onHeadersReceived.addListener(listener, { urls: [url] }, ["responseHeaders"]);
        });

        fetch(url).catch(() => {
            // ltgopenlmsapp://〜みたいなURLにリダイレクトされるのでエラーになる
        });

        const redirectUrl = await redirectUrlPromise;
        if (!redirectUrl.startsWith("ltgopenlmsapp://token=")) {
            throw new Error("Invalid redirect URL");
        }

        const base64 = redirectUrl.substring("ltgopenlmsapp://token=".length);
        const str = atob(base64);
        const split = str.split(":::");
        if (split.length !== 2) {
            throw new Error("Invalid token");
        }
        const [signature, token] = split;

        if (signature !== md5(`https://wsdmoodle.waseda.jp${passport}`)) {
            throw new Error("Invalid signature");
        }

        return token;
    } else {
        // ChromeではWebRequestが使えないので、プロファイルページのQRコードからトークンを取得する
        return getWebServiceTokenFromQRCode();
    }
}

let webServiceTokenCache: string | null = null;

export const callMoodleMobileAPI = limitRate(1000, async <T, U>(request: MoodleRequest<T>): Promise<U> => {
    const token = webServiceTokenCache ?? (webServiceTokenCache = await getWebServiceToken());

    const formData = new FormData();
    formData.append("wstoken", token);
    formData.append("wsfunction", request.methodname);

    const serialize = (path: string, value: any) => {
        if (value === undefined) {
            return;
        } else if (value === null) {
            formData.append(path, "null");
        } else if (typeof value === "boolean" || typeof value === "number") {
            formData.append(path, value.toString());
        } else if (typeof value === "string") {
            formData.append(path, value);
        } else if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                serialize(`${path}[${i}]`, value[i]);
            }
        } else {
            for (const key of Object.keys(value)) {
                serialize(`${path}[${key}]`, value[key]);
            }
        }
    };

    if (request.args !== undefined) {
        if (typeof request.args !== "object" || request.args === null) {
            throw new Error("Invalid args");
        }

        for (const key of Object.keys(request.args)) {
            serialize(key, (request.args as any)[key]);
        }
    }

    const response = await fetch("https://wsdmoodle.waseda.jp/webservice/rest/server.php?moodlewsrestformat=json", {
        method: "POST",
        body: formData,
    });

    const json = await response.json();

    if (json.exception) {
        throw new Error(
            `Moodle API error: ${json.message} (exception: ${json.exception}, errorcode: ${json.errorcode})`
        );
    }

    return json;
});
