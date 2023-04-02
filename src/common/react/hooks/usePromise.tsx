import { useEffect, useState } from "react";

export type PromiseState = "pending" | "fulfilled" | "rejected";

/**
 * Promiseをいい感じに扱うhook
 *
 * @param f - Promiseを返す関数
 * @param deps - useEffectのdeps
 * @returns Promiseの状態、値、エラー
 */
export function usePromise<T>(
    f: () => Promise<T>,
    deps: any[] = []
): { state: PromiseState; value: T | undefined; error: unknown } {
    const [state, setState] = useState<PromiseState>("pending");
    const [value, setValue] = useState<T>();
    const [error, setError] = useState<unknown>();
    useEffect(() => {
        let isCancelled = false;
        f().then(
            (value) => {
                if (isCancelled) return;
                setValue(value);
                setState("fulfilled");
            },
            (error) => {
                if (isCancelled) return;
                setError(error);
                setState("rejected");
            }
        );

        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return { state, value, error };
}
