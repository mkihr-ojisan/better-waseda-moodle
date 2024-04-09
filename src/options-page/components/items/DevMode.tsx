import { FC, PropsWithChildren } from "react";
import { useOptionsPageContext } from "../OptionsPage";

export const DevModeOnly: FC<PropsWithChildren> = (props: { children?: React.ReactNode }) => {
    const context = useOptionsPageContext();
    return context.devMode ? props.children : null;
};
