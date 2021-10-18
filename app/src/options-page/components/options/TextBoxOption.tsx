import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import React, { useCallback } from 'react';
import { useContext } from 'react';
import useConfig from '../../../common/react/useConfig';
import { DisabledOptionsContext } from './DisableOptions';
import { ConfigKey } from '../../../common/config/config';
import { InternalError } from '../../../common/error';

type Props = {
    configKey: ConfigKey;
    inputType?: string;
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
};

const useStyles = makeStyles(() => ({
    listItemRoot: {
        paddingRight: 250,
    },
}));

export default React.memo(function TextBoxOption(props: Props) {
    const [value, setValue] = useConfig(props.configKey);
    if (typeof value !== 'string') throw new InternalError('`value` must be string.');

    const disabled = useContext(DisabledOptionsContext);
    const classes = useStyles();

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
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
                <TextField
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    type={props.inputType}
                    placeholder={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                    variant="standard"
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
});
