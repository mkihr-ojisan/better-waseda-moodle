import { assertExtensionContext } from "@/common/util/context";
import { getSessionKey } from "../../auto-login/session-key-cache";
import { postJSON } from "../../util/fetch";
import { limitRate } from "../../util/limit-rate";
import { doAutoLogin } from "@/common/auto-login/auto-login";
import { registerNetRequestRules } from "@/common/config/declarativeNetRequest";

assertExtensionContext("background");

export type MoodleRequest<T = unknown> = {
    methodname: string;
    args: T;
};

export type MoodleResponse<T = unknown> = MoodleSuccessResponse<T> | MoodleErrorResponse;
export type MoodleSuccessResponse<T = unknown> = { error: false; data: T }[];
export type MoodleErrorResponse = { error: true; exception: { message: string } }[] | { error: string };

/**
 * MoodleのAPIを呼び出すための初期化処理。
 */
export function initMoodleAPI(): void {
    // APIを呼び出すときのUser-Agentを"MoodleMobile"にする
    // こうしないと使えないAPIがある
    registerNetRequestRules(null, [
        {
            condition: {
                urlFilter: "|https://wsdmoodle.waseda.jp/lib/ajax/service.php*",
            },
            action: {
                type: "modifyHeaders",
                requestHeaders: [
                    {
                        header: "User-Agent",
                        operation: "set",
                        value: "MoodleMobile",
                    },
                ],
            },
        },
    ]);
}

/**
 * MoodleのWeb APIを呼び出す。セッションキーは自動的に取得される。
 */
export const callMoodleAPI = limitRate(
    1000,
    async <T, U>(
        requests: MoodleRequest<T>[],
        options: { noRetryOnSessionExpired?: boolean } = {}
    ): Promise<MoodleSuccessResponse<U>> => {
        const response = await postJSON<MoodleResponse<U>>(
            `https://wsdmoodle.waseda.jp/lib/ajax/service.php?sesskey=${await getSessionKey()}`,
            requests.map((r, index) => ({ index, ...r }))
        );

        if ("error" in response) throw Error(response.error);
        for (const r of response) {
            if (r.error) {
                if (
                    "exception" in r &&
                    typeof r.exception === "object" &&
                    r.exception &&
                    "errorcode" in r.exception &&
                    (r.exception.errorcode === "servicerequireslogin" || r.exception.errorcode === "invalidsesskey") &&
                    !options.noRetryOnSessionExpired
                ) {
                    // セッションキーが期限切れの場合は再ログインしてリトライ
                    await doAutoLogin({ skipCheck: true });
                    return callMoodleAPI(requests, { noRetryOnSessionExpired: true });
                } else {
                    throw Error(r.exception.message);
                }
            }
        }

        return response as MoodleSuccessResponse<U>;
    }
);
