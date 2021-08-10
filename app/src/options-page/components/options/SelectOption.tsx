import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useContext } from 'react';
import { ConfigKeyWithType, ConfigValue } from '../../../common/config/config';
import useConfig from '../../../common/react/useConfig';
import { DisabledOptionsContext } from './DisableOptions';

type Props<T extends string> = {
    configKey: ConfigKeyWithType<T>;
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
    const disabled = useContext(DisabledOptionsContext);
    const classes = useStyles();

    const handleChange = useCallback(
        (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
            setValue(event.target.value as ConfigValue<ConfigKeyWithType<T>>);
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
                <Select
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    classes={{ root: classes.selectRoot }}
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
