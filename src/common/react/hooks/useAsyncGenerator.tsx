import { useCallback, useEffect, useState } from "react";

export type AsyncGeneratorState = "pending" | "yielded" | "done";

export type UseAsyncGenerator<T> = {
    /** `AsyncGenerator`の状態を表す文字列 */
    state: AsyncGeneratorState;
    /** `AsyncGenerator`が`yield`した値。まだ一度も`yield`していない場合は`undefined` */
    value: T | undefined;
    /** `AsyncGenerator`が例外をスローした場合、そのエラー */
    error: unknown;
    /** `AsyncGenerator`を再度呼び出す */
    reload: (noRemoveCurrentValue?: boolean) => void;
};

/**
 * 非同期ジェネレータがyieldする値を使用するフック
 *
 * @param generator - 非同期ジェネレータを返す関数
 * @param deps - フックの依存配列
 * @returns 非同期ジェネレータがyieldした値
 */
export function useAsyncGenerator<T>(
    generator: () => AsyncGenerator<T> | Promise<AsyncGenerator<T>>,
    deps: unknown[]
): UseAsyncGenerator<T> {
    const [state, setState] = useState<AsyncGeneratorState>("pending");
    const [value, setValue] = useState<T>();
    const [error, setError] = useState<unknown>();

    const [refreshSignal, setRefreshSignal] = useState(0);

    useEffect(() => {
        let isCancelled = false;

        (async () => {
            try {
                for await (const value of await generator()) {
                    if (isCancelled) return;
                    setState("yielded");
                    setValue(value);
                }
                if (isCancelled) return;
                setState("done");
            } catch (error) {
                if (isCancelled) return;
                setError(error);
                setState("done");
            }
        })();

        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, refreshSignal]);

    const reload = useCallback((noRemoveCurrentValue?: boolean) => {
        setRefreshSignal((s) => s + 1);
        if (noRemoveCurrentValue) {
            setState("yielded");
        } else {
            setState("pending");
            setValue(undefined);
            setError(undefined);
        }
    }, []);

    return { state, value, error, reload };
}
