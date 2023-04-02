import { PromiseState, usePromise } from "../react/hooks/usePromise";
import { call } from "../util/messenger/client";
import { Constants } from "./constants";

/**
 * Constantsを取得するフック
 *
 * @returns Constants
 */
export function useConstants(): { state: PromiseState; value: Constants | undefined; error: unknown } {
    return usePromise(() => call("getConstants"), []);
}
