import { ConfigKey, getConfig } from "../config/config";
import { LoginRequiredError } from "../error";

/**
 * Configで指定されたログイン情報を取得する。設定されていない場合は例外を投げる。
 *
 * @returns ログイン情報
 */
export function getLoginInfo(): { userId: string; password: string } {
    const loginInfo = getConfig(ConfigKey.LoginInfo);
    if (!loginInfo.password || !loginInfo.userId) throw new LoginRequiredError();
    return loginInfo;
}
