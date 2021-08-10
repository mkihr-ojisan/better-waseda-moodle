import React, { ReactElement } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import List from '@material-ui/core/List';
import OptionConfigSync from './OptionConfigSync';
import OptionBackupConfig from './OptionBackupConfig';
import OptionRestoreConfig from './OptionRestoreConfig';

export default {
    title: 'optionsSectionGeneral',
    Icon: SettingsIcon,
    Component: function SectionGeneral(): ReactElement {
        return (
            <List>
                <OptionConfigSync />
                <OptionBackupConfig />
                <OptionRestoreConfig />
            </List>
        );
    },
};
