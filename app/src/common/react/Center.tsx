import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
    },
}));

export default React.memo(function Center(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.root} justifyContent="center" alignItems="center">
            <Grid item>{props.children}</Grid>
        </Grid>
    );
});
