import React, { useEffect, useState } from 'react';
import { CachedPromise } from '../util/ExPromise';

export function usePromise<T>(promise: () => Promise<T>, deps?: React.DependencyList | undefined): T | undefined {
    const [value, setValue] = useState<T | undefined>(undefined);

    useEffect(() => {
        let isCancelled = false;
        promise().then((v) => {
            if (!isCancelled) setValue(v);
        });
        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return value;
}

export type CachedPromiseState = 'pending' | 'cacheReturned' | 'fulfilled';
export function useCachedPromise<T>(
    f: () => CachedPromise<T>,
    deps?: React.DependencyList | undefined
): [T | undefined, CachedPromiseState] {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [state, setState] = useState<CachedPromiseState>('pending');

    useEffect(() => {
        let isCancelled = false;
        const promise = f();
        promise.cachedValue.then((v) => {
            if (!isCancelled) {
                setValue(v);
                setState('cacheReturned');
            }
        });
        promise.then((v) => {
            if (!isCancelled) {
                setValue(v);
                setState('fulfilled');
            }
        });
        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return [value, state];
}
