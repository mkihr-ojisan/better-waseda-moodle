import React, { useEffect, useState } from 'react';

export function usePromise<T>(
    promise: () => Promise<T>,
    deps?: React.DependencyList | undefined
): [T | undefined, unknown] {
    const [value, setValue] = useState<T | undefined>(undefined);
    const [error, setError] = useState<unknown>(undefined);

    useEffect(() => {
        let isCancelled = false;
        promise()
            .then((v) => {
                if (!isCancelled) setValue(v);
            })
            .catch((e) => {
                setError(e);
            });
        return () => {
            isCancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return [value, error];
}
