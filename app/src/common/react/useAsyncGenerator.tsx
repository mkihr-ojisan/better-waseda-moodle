import { useEffect, useState } from 'react';

export function useAsyncGenerator<T>(
    fn: () => AsyncGenerator<T, T | undefined | void, undefined>,
    deps: any[] = []
):
    | { state: 'not_yielded'; value: undefined; done: false }
    | { state: 'yielded'; value: T; done: boolean }
    | { state: 'error'; error: unknown; value: undefined; done: true } {
    const [state, setState] = useState<'not_yielded' | 'yielded' | 'error'>('not_yielded');
    const [error, setError] = useState<unknown>();
    const [value, setValue] = useState<T>();
    const [done, setDone] = useState<boolean>(false);

    useEffect(() => {
        setState('not_yielded');
        setError(undefined);
        setValue(undefined);
        setDone(false);

        let isCancelled = false;
        (async () => {
            const generator = fn();

            for (;;) {
                try {
                    const { value: nextValue, done: nextDone } = await generator.next();
                    setState('yielded');

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
                    setState('error');
                    setError(e);
                }
            }
        })();

        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    if (state === 'not_yielded') {
        return { state, value: undefined, done: false };
    } else if (state === 'yielded') {
        return { state, value: value!, done };
    } else {
        return { state, error, value: undefined, done: true };
    }
}
