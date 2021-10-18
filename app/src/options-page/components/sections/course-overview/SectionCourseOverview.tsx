import React, { ReactElement } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import SelectOption from '../../options/SelectOption';
import ToggleOption from '../../options/ToggleOption';
import DisableOptions from '../../options/DisableOptions';
import OptionClearCourseListCache from './OptionClearCourseListCache';
import OptionFetchTimetableDataAndSyllabusUrl from './OptionFetchTimetableDataAndSyllabusUrl';
import Divider from '@mui/material/Divider';
import NoPaddingList from '../../NoPaddingList';

export default {
    name: 'SectionCourseOverview',
    title: 'optionsSectionCourseOverview',
    Icon: AppsIcon,
    Component: function SectionGeneral(): ReactElement {
        return (
            <NoPaddingList>
                <ToggleOption
                    configKey="courseOverview.enabled"
                    message="optionsEnableCourseOverview"
                    description="optionsEnableCourseOverviewDescription"
                />

                <DisableOptions configKey="courseOverview.enabled">
                    <SelectOption<'normal' | 'timetable'>
                        configKey="courseOverview.type"
                        message="optionsCourseOverviewTypeLabel"
                        items={[
                            { value: 'normal', message: 'optionsCourseOverviewTypeNormal' },
                            { value: 'timetable', message: 'optionsCourseOverviewTypeTimetable' },
                        ]}
                    />
                    <ToggleOption
                        configKey="timetable.showPeriodTime"
                        message="optionsCourseOverviewTimetableShowPeriodTime"
                    />
                </DisableOptions>
                <Divider />
                <OptionClearCourseListCache />
                <Divider />
                <OptionFetchTimetableDataAndSyllabusUrl />
            </NoPaddingList>
        );
    },
};
