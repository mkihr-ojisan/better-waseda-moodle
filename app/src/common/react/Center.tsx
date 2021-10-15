import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
    },
}));

export type CenterProps = {
    children?: ReactNode;
    className?: string;
};

export default React.memo(function Center(props: CenterProps) {
    const classes = useStyles();

    return (
        <Grid container className={clsx(classes.root, props.className)} justifyContent="center" alignItems="center">
            <Grid item>{props.children}</Grid>
        </Grid>
    );
});
