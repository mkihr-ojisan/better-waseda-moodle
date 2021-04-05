import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { ReactElement, ReactNode } from 'react';

type Props = {
    expanded: boolean;
    onChange: (_: React.ChangeEvent<{}>, newExpanded: boolean) => void;
    children: ReactNode;
    titleMessageName: string;
};

const useStyles = makeStyles(theme => ({
    sectionContentRoot: {
        marginBlockStart: theme.spacing(2),
        marginBlockEnd: theme.spacing(4),
    },
}));

export default function Section(props: Props): ReactElement {
    const classes = useStyles();

    return (
        <Container>
            <Typography variant="h6" color="textPrimary">
                {browser.i18n.getMessage(props.titleMessageName)}
            </Typography>
            <Typography component="div" classes={{ root: classes.sectionContentRoot }} color="textPrimary">
                {props.children}
            </Typography>
        </Container>
    );
}