import React, { PropsWithChildren, useEffect } from 'react';
import { useMemo } from 'react';
import { ReactElement } from 'react';
import { ConfigKey, ConfigValue, getAllConfig } from '../config/config';
import { InternalError } from '../error';
import { usePromise } from './usePromise';

export type ConfigContextValue =
    | {
          getConfig: <T extends ConfigKey>(key: T) => ConfigValue<T>;
          setConfig: <T extends ConfigKey>(key: T, value: ConfigValue<T>) => void;
      }
    | undefined;

export const ConfigContext = React.createContext<ConfigContextValue>(undefined);

export function ConfigContextProvider(props: PropsWithChildren<{}>): ReactElement | null {
    const config = usePromise(() => getAllConfig(), []);

    useEffect(() => {
        const listener = (changes: browser.storage.StorageChange) => {
            if (!config) throw new InternalError('unreachable');

            for (const [key, { newValue }] of Object.entries(changes)) {
                (config as any)[key] = newValue;
            }
        };
        if (config) {
            browser.storage.onChanged.addListener(listener);
            return () => {
                browser.storage.onChanged.removeListener(listener);
            };
        }
    }, [config]);

    const value = useMemo(
        () =>
            config && {
                getConfig<T extends ConfigKey>(key: T): ConfigValue<T> {
                    return config[key];
                },
                setConfig<T extends ConfigKey>(key: T, value: ConfigValue<T>): void {
                    config[key] = value;
                },
            },
        [config]
    );

    if (!value) return null;

    return <ConfigContext.Provider value={value}>{props.children}</ConfigContext.Provider>;
}
