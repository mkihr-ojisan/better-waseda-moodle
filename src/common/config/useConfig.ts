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
