import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import React, { createContext, FC, ReactNode, useContext } from "react";

export const DisableOptionsContext = createContext(false);

export type ConfigDisableOptionsProps = {
    configKey: ConfigKey;
    children: ReactNode;
};

export const ConfigDisableOptions: FC<ConfigDisableOptionsProps> = (props) => {
    const [enabled] = useConfig(props.configKey);
    return <DisableOptions disabled={!enabled}>{props.children}</DisableOptions>;
};

export type DisableOptionsProps = {
    disabled: boolean;
    children: ReactNode;
};

export const DisableOptions: FC<DisableOptionsProps> = (props) => {
    const parentValue = useContext(DisableOptionsContext);

    return (
        <DisableOptionsContext.Provider value={parentValue || props.disabled}>
            {props.children}
        </DisableOptionsContext.Provider>
    );
};
