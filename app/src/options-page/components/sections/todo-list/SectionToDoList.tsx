import React, { ReactElement } from 'react';
import ToggleOption from '../../options/ToggleOption';
import NoPaddingList from '../../NoPaddingList';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DisableOptions from '../../options/DisableOptions';
import HiddenToDoItems from './HiddenToDoItems';

export default {
    name: 'SectionToDoList',
    title: 'optionsSectionToDoList',
    Icon: FormatListBulletedIcon,
    Component: function SectionToDoList(): ReactElement {
        return (
            <NoPaddingList>
                <ToggleOption
                    configKey="todo.enabled"
                    message="optionsToDoListEnabled"
                    description="optionsToDoListEnabledDescription"
                />
                <DisableOptions configKey="todo.enabled">
                    <HiddenToDoItems />
                </DisableOptions>
            </NoPaddingList>
        );
    },
};
