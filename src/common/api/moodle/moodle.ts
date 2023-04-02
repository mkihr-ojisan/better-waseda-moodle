import { assertExtensionContext } from "@/common/util/context";
import { getSessionKey } from "../../auto-login/session-key-cache";
import { postJSON } from "../../util/fetch";
import { limitRate } from "../../util/limit-rate";

assertExtensionContext("background");

export type MoodleRequest<T = unknown> = {
    methodname: string;
    args: T;
};

export type MoodleResponse<T = unknown> = MoodleSuccessResponse<T> | MoodleErrorResponse;
export type MoodleSuccessResponse<T = unknown> = { error: false; data: T }[];
export type MoodleErrorResponse = { error: true; exception: { message: string } }[] | { error: string };

/**
 * MoodleのWeb APIを呼び出す。セッションキーは自動的に取得される。
 */
export const callMoodleAPI = limitRate(
    1000,
    async <T, U>(requests: MoodleRequest<T>[]): Promise<MoodleSuccessResponse<U>> => {
        const response = await postJSON<MoodleResponse<U>>(
            `https://wsdmoodle.waseda.jp/lib/ajax/service.php?sesskey=${await getSessionKey()}`,
            requests.map((r, index) => ({ index, ...r }))
        );

        if ("error" in response) throw Error(response.error);
        for (const r of response) {
            if (r.error) throw Error(r.exception.message);
        }

        return response as MoodleSuccessResponse<U>;
    }
);
