import { postJSON } from "@/common/util/fetch";

/**
 * セッションキーが有効かどうかを確認する
 *
 * @param sessionKey - セッションキー
 * @returns セッションキーが有効な場合はtrue、そうでない場合はfalse
 */
export async function checkSessionKey(sessionKey: string): Promise<boolean> {
    try {
        const response = (await postJSON(`https://wsdmoodle.waseda.jp/lib/ajax/service.php?sesskey=${sessionKey}`, [
            { index: 0, methodname: "core_session_touch", args: {} },
        ])) as { error: boolean }[];

        return !response?.[0]?.error;
    } catch (e) {
        return false;
    }
}
