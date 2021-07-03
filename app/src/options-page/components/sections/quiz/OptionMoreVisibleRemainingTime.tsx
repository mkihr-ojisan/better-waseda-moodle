import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import useConfig from '../../../../common/react/useConfig';
import Description from '../../Description';

export default function OptionMoreVisibleRemainingTime(): ReactElement | null {
    const [value, setValue] = useConfig('moreVisibleRemainingTime.enabled');

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.checked);
    }

    return (
        <>
            <FormControlLabel
                control={<Switch checked={value} onChange={handleChange} />}
                label={browser.i18n.getMessage('optionsMoreVisibleRemainingTime')}
            />
            <Description messageName="optionsMoreVisibleRemainingTimeDescription" />
        </>
    );
}