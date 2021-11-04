import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import { useContext } from 'react';
import { ConfigKey } from '../../../common/config/config';
import useConfig from '../../../common/react/useConfig';
import { DisabledOptionsContext } from './DisableOptions';

type Props<T extends string> = {
    configKey: ConfigKey;
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    items: {
        value: T;
        message: string;
        messageSubstitutions?: string | string[];
    }[];
};

const useStyles = makeStyles(() => ({
    listItemRoot: {
        paddingRight: 250,
    },
    selectRoot: {
        width: 193,
    },
}));

export default React.memo(SelectOption) as typeof SelectOption;
function SelectOption<T extends string>(props: Props<T>) {
    const [value, setValue] = useConfig(props.configKey);
    if (typeof value !== 'string') throw Error('`value` must be string.');

    const disabled = useContext(DisabledOptionsContext);
    const classes = useStyles();

    const handleChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            setValue(event.target.value as T);
        },
        [setValue]
    );

    return (
        <ListItem disabled={disabled} classes={{ root: classes.listItemRoot }}>
            <ListItemText
                primary={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                secondary={
                    props.description && browser.i18n.getMessage(props.description, props.descriptionSubstitutions)
                }
            />
            <ListItemSecondaryAction>
                <Select<T>
                    value={value as T}
                    onChange={handleChange}
                    disabled={disabled}
                    classes={{ root: classes.selectRoot }}
                    variant="standard"
                >
                    {props.items.map((item) => (
                        <MenuItem value={item.value} key={item.value}>
                            {browser.i18n.getMessage(item.message, item.messageSubstitutions)}
                        </MenuItem>
                    ))}
                </Select>
            </ListItemSecondaryAction>
        </ListItem>
    );
}
