import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React, { ReactElement } from 'react';
import { useCallback } from 'react';
import { YearTerm, yearTermToString } from '../../../common/waseda/course/course';

type Props = {
    terms: YearTerm[];
    selectedIndex: number | null;
    onChange?: (selectedTerm: YearTerm, selectedIndex: number) => void;
};

export default React.memo(function TimetableTermSelector(props: Props): ReactElement {
    const handleChange = useCallback(
        (event: SelectChangeEvent<number | null>) => {
            const selectedIndex = event.target.value as number;
            props.onChange?.(props.terms[selectedIndex], selectedIndex);
        },
        [props]
    );
    const noEntryRenderValue = useCallback(() => browser.i18n.getMessage('courseOverviewTimetableNoEntry'), []);

    if (props.terms.length > 0) {
        return (
            <FormControl>
                <Select value={props.selectedIndex} onChange={handleChange} variant="standard">
                    {props.terms.map((term, i) => {
                        return (
                            <MenuItem value={i} key={i}>
                                {yearTermToString(term)}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    } else {
        return (
            <FormControl disabled>
                <Select value="" renderValue={noEntryRenderValue} displayEmpty />
            </FormControl>
        );
    }
});
