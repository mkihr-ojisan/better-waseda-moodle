import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useContext } from 'react';
import { DisabledOptionsContext } from './DisableOptions';

type Props = {
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    buttonMessage: string;
    buttonMessageSubstitutions?: string | string[];
    onClick: () => void;
};

const useStyles = makeStyles(() => ({
    listItemRoot: {
        paddingRight: 160,
    },
}));

export default React.memo(function TextBoxOption(props: Props) {
    const disabled = useContext(DisabledOptionsContext);
    const classes = useStyles();

    return (
        <ListItem disabled={disabled} classes={{ root: classes.listItemRoot }}>
            <ListItemText
                primary={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                secondary={
                    props.description && browser.i18n.getMessage(props.description, props.descriptionSubstitutions)
                }
            />
            <ListItemSecondaryAction>
                <Button variant="outlined" onClick={props.onClick} disabled={disabled}>
                    {browser.i18n.getMessage(props.buttonMessage, props.buttonMessageSubstitutions)}
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    );
});
