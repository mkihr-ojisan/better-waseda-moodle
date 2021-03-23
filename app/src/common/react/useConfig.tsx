import { useEffect, useState } from 'react';
import { ConfigKey, ConfigValue, onConfigChange, removeConfigChangeListener, setConfig } from '../config/config';

// configの取得は非同期なのでまだ値が取得されていないときはundefinedを返す
export default function useConfig<T extends ConfigKey>(key: T): [ConfigValue<T> | undefined, (value: ConfigValue<T>) => void] {
    const [value, setValue] = useState<ConfigValue<T> | undefined>(undefined);

    useEffect(() => {
        const listener = (_: ConfigValue<T> | undefined, newValue: ConfigValue<T>) => {
            setValue(newValue);
        };
        onConfigChange<T>(key, listener, true);
        return () => {
            removeConfigChangeListener(key, listener);
        };
    }, [key]);

    return [value, v => setConfig(key, v)];
}