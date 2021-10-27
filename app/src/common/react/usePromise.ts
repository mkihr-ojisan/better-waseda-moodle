import React, { useEffect, useState } from 'react';

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
