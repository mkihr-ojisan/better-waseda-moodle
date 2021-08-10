import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useCallback } from 'react';
import { useContext } from 'react';
import { ConfigKeyWithType } from '../../../common/config/config';
import useConfig from '../../../common/react/useConfig';
import { DisabledOptionsContext } from './DisableOptions';

type Props = {
    configKey: ConfigKeyWithType<string>;
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
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
});
