import { useEffect, useState } from 'react';
import { onConfigChange, removeConfigChangeListener, setConfig } from '../config/config';

// configの取得は非同期なのでまだ値が取得されていないときはundefinedを返す
export default function useConfig<T>(key: string): [T | undefined, (value: T) => void] {
    const [value, setValue] = useState<T | undefined>(undefined);

    useEffect(() => {
        const listener = (_: T | undefined, newValue: T) => {
            setValue(newValue);
        };
        onConfigChange<T>(key, listener, true);
        return () => {
            removeConfigChangeListener(key, listener);
        };
    }, [key]);

    return [value, v => setConfig(key, v)];
}