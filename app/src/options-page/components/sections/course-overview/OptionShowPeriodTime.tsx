import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import { useCallback } from 'react';
import useConfig from '../../../../common/react/useConfig';

export default function OptionShowPeriodTime(): ReactElement | null {
    const [enabled] = useConfig('courseOverview.enabled');
    const [courseOverviewType] = useConfig('courseOverview.type');
    const [showPeriodTime, setShowPeriodTime] = useConfig('timetable.showPeriodTime');

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setShowPeriodTime(event.target.checked);
        },
        [setShowPeriodTime]
    );

    if (showPeriodTime === undefined) return null;

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={showPeriodTime}
                    onChange={handleChange}
                    disabled={!enabled || courseOverviewType !== 'timetable'}
                />
            }
            label={browser.i18n.getMessage('optionsCourseOverviewTimetableShowPeriodTime')}
        />
    );
}
