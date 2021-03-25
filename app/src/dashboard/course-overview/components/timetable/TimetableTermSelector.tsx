import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, { ReactElement } from 'react';
import { YearTerm, yearTermToString } from '../../../../common/course';

type Props = {
    terms: YearTerm[];
    selectedIndex: number | null;
    onChange?: (selectedTerm: YearTerm, selectedIndex: number) => void;
};

export default function TimetableTermSelector(props: Props): ReactElement {
    const handleChange = (event: React.ChangeEvent<{ value: unknown; }>) => {
        const selectedIndex = event.target.value as number;
        props.onChange?.(props.terms[selectedIndex], selectedIndex);
    };

    if (props.terms.length > 0) {
        return (
            <FormControl>
                <Select
                    value={props.selectedIndex}
                    onChange={handleChange}
                >
                    {
                        props.terms.map((term, i) => {
                            return <MenuItem value={i} key={i}>{yearTermToString(term)}</MenuItem>;
                        })
                    }
                </Select>
            </FormControl>
        );
    } else {
        return (
            <FormControl disabled>
                <Select
                    value=""
                    renderValue={() => browser.i18n.getMessage('courseOverviewTimetableNoEntry')}
                    displayEmpty
                />
            </FormControl>
        );
    }
}
