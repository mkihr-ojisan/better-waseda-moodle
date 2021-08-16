import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
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
