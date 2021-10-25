import React, { ReactElement } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import OptionConfigSync from './OptionConfigSync';
import OptionBackupConfig from './OptionBackupConfig';
import OptionRestoreConfig from './OptionRestoreConfig';
import Divider from '@mui/material/Divider';
import NoPaddingList from '../../NoPaddingList';

export default {
    name: 'SectionGeneral',
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
