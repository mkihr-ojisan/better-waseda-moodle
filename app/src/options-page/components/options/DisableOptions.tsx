import React, { createContext, ReactNode } from 'react';
import { ConfigKey } from '../../../common/config/config';
import useConfig from '../../../common/react/useConfig';

export const DisabledOptionsContext = createContext(false);

type Props = {
    configKey: ConfigKey;
    children?: ReactNode;
};

export default React.memo(function DisableOptions(props: Props) {
    const [enabled] = useConfig(props.configKey);

    return <DisabledOptionsContext.Provider value={!enabled}>{props.children}</DisabledOptionsContext.Provider>;
});
