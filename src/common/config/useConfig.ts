import { useCallback, useEffect, useState } from "react";
import {
    addOnConfigChangeListener,
    ConfigKey,
    ConfigValue,
    getConfig,
    removeOnConfigChangeListener,
    setConfig,
} from "./config";

/**
 * 指定したキーのconfigを取得する。
 *
 * @param key - 取得するconfigのキー
 * @returns configの値と、configの値を変更する関数
 */
export function useConfig<T extends ConfigKey>(key: T): [ConfigValue<T>, (value: ConfigValue<T>) => void] {
    const [value, setValue] = useState<ConfigValue<T>>(getConfig(key));
    useEffect(() => {
        addOnConfigChangeListener(key, setValue, true);
        return () => removeOnConfigChangeListener(key, setValue);
    }, [key]);

    const setConfigValue = useCallback(
        (value: ConfigValue<T>) => {
            setConfig(key, value);
        },
        [key]
    );

    return [value, setConfigValue];
}

/**
 * 指定したキーのconfigの変更を検知し、変化する値を返す。
 *
 * @param key - 監視するconfigのキー
 * @returns configの値が変更された回数
 */
export function useConfigChangeSignal<T extends ConfigKey>(key: T): number {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const listener = () => setValue((v) => v + 1);
        addOnConfigChangeListener(key, listener);
        return () => removeOnConfigChangeListener(key, listener);
    }, [key]);

    return value;
}
