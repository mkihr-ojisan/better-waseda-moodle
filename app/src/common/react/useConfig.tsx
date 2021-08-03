import { useEffect, useRef, useState } from 'react';
import { ConfigKey, ConfigValue, onConfigChange, removeConfigChangeListener, setConfig } from '../config/config';
import equal from 'fast-deep-equal';
import { useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import { useCallback } from 'react';

// configの取得は非同期なのでまだ値が取得されていないときはundefinedを返す
export default function useConfig<T extends ConfigKey>(
    key: T
): [ConfigValue<T> | undefined, (value: ConfigValue<T>) => void] {
    const context = useContext(ConfigContext);

    const [value, setValue] = useState<ConfigValue<T> | undefined>(context?.getConfig(key));
    const valueRef = useRef<ConfigValue<T>>();

    useEffect(() => {
        const listener = (_: ConfigValue<T> | undefined, newValue: ConfigValue<T>) => {
            if (!equal(valueRef.current, newValue)) {
                valueRef.current = newValue;
                setValue(newValue);
            }
        };
        onConfigChange<T>(key, listener, context === undefined);
        return () => {
            removeConfigChangeListener(key, listener);
        };
    }, [context, key]);

    return [
        value,
        useCallback(
            (v) => {
                setConfig(key, v);
                valueRef.current = v;
                setValue(v);
            },
            [key]
        ),
    ];
}
