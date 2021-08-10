import React, { ReactElement } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ToggleOption from '../../options/ToggleOption';
import List from '@material-ui/core/List';
import DisableOptions from '../../options/DisableOptions';
import Indent from '../../options/Indent';
import TextBoxOption from '../../options/TextBoxOption';

export default {
    title: 'optionsSectionAutoLogin',
    Icon: ExitToAppIcon,
    Component: function SectionGeneral(): ReactElement {
        return (
            <List>
                <ToggleOption
                    configKey="autoLogin.enabled"
                    message="optionsEnableAutoLogin"
                    description="optionsEnableAutoLoginDescription"
                />
                <DisableOptions configKey="autoLogin.enabled">
                    <TextBoxOption configKey="autoLogin.loginId" message="optionsLoginId" />
                    <TextBoxOption configKey="autoLogin.password" message="optionsPassword" inputType="password" />
                </DisableOptions>
            </List>
        );
    },
};
