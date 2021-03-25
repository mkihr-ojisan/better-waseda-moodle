import { useEffect, useRef, useState } from 'react';
import { ConfigKey, ConfigValue, onConfigChange, removeConfigChangeListener, setConfig } from '../config/config';
import equal from 'fast-deep-equal';

// configの取得は非同期なのでまだ値が取得されていないときはundefinedを返す
export default function useConfig<T extends ConfigKey>(key: T): [ConfigValue<T> | undefined, (value: ConfigValue<T>) => void] {
    const [value, setValue] = useState<ConfigValue<T> | undefined>(undefined);
    const valueRef = useRef<ConfigValue<T>>();

    useEffect(() => {
        const listener = (_: ConfigValue<T> | undefined, newValue: ConfigValue<T>) => {
            if (!equal(valueRef.current, newValue)) {
                valueRef.current = newValue;
                setValue(newValue);
            }
        };
        onConfigChange<T>(key, listener, true);
        return () => {
            removeConfigChangeListener(key, listener);
        };
    }, [key]);

    return [
        value,
        v => {
            setConfig(key, v);
            valueRef.current = v;
            setValue(v);
        },
    ];
}