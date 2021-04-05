import { CircularProgress, Grid } from '@material-ui/core';
import React, { ReactElement } from 'react';

export default function CenteredCircularProgress(): ReactElement {
    return (
        <Grid container alignItems="center" justify="center" style={{ width: '100%', height: '100%' }}>
            <Grid item>
                <CircularProgress />
            </Grid>
        </Grid>
    );
}