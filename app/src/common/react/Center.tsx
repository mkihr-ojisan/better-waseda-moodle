import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
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
