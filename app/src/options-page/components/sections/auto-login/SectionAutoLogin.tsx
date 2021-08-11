import React, { ReactElement } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ToggleOption from '../../options/ToggleOption';
import DisableOptions from '../../options/DisableOptions';
import TextBoxOption from '../../options/TextBoxOption';
import NoPaddingList from '../../NoPaddingList';

export default {
    name: 'SectionAutoLogin',
    title: 'optionsSectionAutoLogin',
    Icon: ExitToAppIcon,
    Component: function SectionGeneral(): ReactElement {
        return (
            <NoPaddingList>
                <ToggleOption
                    configKey="autoLogin.enabled"
                    message="optionsEnableAutoLogin"
                    description="optionsEnableAutoLoginDescription"
                />
                <DisableOptions configKey="autoLogin.enabled">
                    <TextBoxOption configKey="autoLogin.loginId" message="optionsLoginId" />
                    <TextBoxOption configKey="autoLogin.password" message="optionsPassword" inputType="password" />
                </DisableOptions>
            </NoPaddingList>
        );
    },
};
