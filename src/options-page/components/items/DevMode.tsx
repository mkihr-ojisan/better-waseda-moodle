import { FC, PropsWithChildren } from "react";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";

export const DevModeOnly: FC<PropsWithChildren> = (props: { children?: React.ReactNode }) => {
    const [devMode] = useConfig(ConfigKey.DevMode);
    return devMode ? props.children : null;
};
