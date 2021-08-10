import React, { ReactElement } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import OptionConfigSync from './OptionConfigSync';
import OptionBackupConfig from './OptionBackupConfig';
import OptionRestoreConfig from './OptionRestoreConfig';
import Divider from '@material-ui/core/Divider';
import NoPaddingList from '../../NoPaddingList';

export default {
    title: 'optionsSectionGeneral',
    Icon: SettingsIcon,
    Component: function SectionGeneral(): ReactElement {
        return (
            <NoPaddingList>
                <OptionConfigSync />
                <Divider />
                <OptionBackupConfig />
                <Divider />
                <OptionRestoreConfig />
            </NoPaddingList>
        );
    },
};
