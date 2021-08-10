import React, { ReactElement } from 'react';
import AppsIcon from '@material-ui/icons/Apps';
import List from '@material-ui/core/List';
import SelectOption from '../../options/SelectOption';
import ToggleOption from '../../options/ToggleOption';
import DisableOptions from '../../options/DisableOptions';
import Indent from '../../options/Indent';
import OptionClearCourseListCache from './OptionClearCourseListCache';
import OptionFetchTimetableDataAndSyllabusUrl from './OptionFetchTimetableDataAndSyllabusUrl';

export default {
    title: 'optionsSectionCourseOverview',
    Icon: AppsIcon,
    Component: function SectionGeneral(): ReactElement {
        return (
            <List>
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
                <OptionClearCourseListCache />
                <OptionFetchTimetableDataAndSyllabusUrl />
            </List>
        );
    },
};
