import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { DisabledOptionsContext } from './DisableOptions';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

type Props = {
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    href: string;
};

const useStyles = makeStyles(() => ({
    listItemRoot: {},
}));

export default React.memo(function Link(props: Props) {
    const disabled = useContext(DisabledOptionsContext);
    const classes = useStyles();

    const handleClick = useCallback(() => {
        window.open(props.href, '_blank');
    }, [props.href]);

    return (
        <ListItem disabled={disabled} classes={{ root: classes.listItemRoot }} button onClick={handleClick}>
            <ListItemText
                primary={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                secondary={
                    props.description && browser.i18n.getMessage(props.description, props.descriptionSubstitutions)
                }
            />
            <ListItemSecondaryAction>
                <IconButton onClick={handleClick}>
                    <OpenInNewIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
});
