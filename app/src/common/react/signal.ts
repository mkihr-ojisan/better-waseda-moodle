import { useEffect, useMemo } from 'react';

export type Signal<T = undefined> = {
    send: (this: Signal<T>, value: T) => void;
    _callbacks: Set<(value: T) => void>;
};

export function useSignal<T>(): Signal<T> {
    return useMemo(
        () => ({
            _counter: 0,
            _value: undefined,
            send(value: T) {
                this._callbacks.forEach((f) => f(value));
            },
            _callbacks: new Set(),
        }),
        []
    );
}

export function useHandleSignal<T>(signal: Signal<T>, callback: (value: T) => void): void {
    useEffect(() => {
        signal._callbacks.add(callback);
        return () => {
            signal._callbacks.delete(callback);
        };
    }, [signal, callback]);
}
