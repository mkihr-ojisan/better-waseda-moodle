import { useEffect, useState } from 'react';

export function useAsyncGenerator<T>(
    fn: () => AsyncGenerator<T, T | undefined | void, undefined>,
    deps: any[] = []
): { error: unknown; value: T | undefined; done: boolean } {
    const [error, setError] = useState<unknown>();
    const [value, setValue] = useState<T>();
    const [done, setDone] = useState<boolean>(false);

    useEffect(() => {
        setError(undefined);
        setValue(undefined);
        setDone(false);

        let isCancelled = false;
        (async () => {
            const generator = fn();

            for (;;) {
                try {
                    const { value: nextValue, done: nextDone } = await generator.next();

                    if (isCancelled) {
                        return;
                    }
                    if (nextValue) {
                        setValue(nextValue);
                    }
                    if (nextDone) {
                        setDone(true);
                        return;
                    }
                } catch (e) {
                    if (isCancelled) {
                        return;
                    }
                    setError(e);
                }
            }
        })();

        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { error, value, done };
}
