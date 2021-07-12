import { makeStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { ReactElement, ReactNode } from 'react';

type Props = {
    messageName?: string;
    children?: ReactNode;
};

const useStyles = makeStyles((theme) => ({
    root: {
        marginInlineStart: theme.spacing(4),
        marginBottom: theme.spacing(2),
        color: fade(theme.palette.text.primary, 0.8),
    },
}));

export default function Description(props: Props): ReactElement {
    const classes = useStyles();
    return (
        <Typography classes={{ root: classes.root }} variant="body2">
            {props.children || (props.messageName && browser.i18n.getMessage(props.messageName))}
        </Typography>
    );
}
