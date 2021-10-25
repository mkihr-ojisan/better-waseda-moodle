import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { DisabledOptionsContext } from './DisableOptions';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
                <IconButton onClick={handleClick} size="large">
                    <OpenInNewIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
});
