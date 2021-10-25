import { useEffect, useState } from 'react';
import {
    ConfigKey,
    ConfigValue,
    getConfig,
    onConfigChange,
    removeConfigChangeListener,
    setConfig,
} from '../config/config';
import { useCallback } from 'react';
import { useRef } from 'react';

export default function useConfig<T extends ConfigKey>(key: T): [ConfigValue<T>, (value: ConfigValue<T>) => void] {
    const [value, setValue] = useState(() => getConfig(key));

    const isFirstRun = useRef(true);
    useEffect(() => {
        const listener = (_: ConfigValue<T> | undefined, newValue: ConfigValue<T>) => {
            setValue(newValue);
        };
        onConfigChange(key, listener, !isFirstRun.current);
        isFirstRun.current = false;
        return () => {
            removeConfigChangeListener(key, listener);
        };
    });

    return [value, useCallback((value) => setConfig(key, value), [key])];
}
