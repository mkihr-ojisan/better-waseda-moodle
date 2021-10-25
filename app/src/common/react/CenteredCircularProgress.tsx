import { CircularProgress, Grid } from '@mui/material';
import React, { ReactElement } from 'react';

export default function CenteredCircularProgress(): ReactElement {
    return (
        <Grid container alignItems="center" justifyContent="center" style={{ width: '100%', height: '100%' }}>
            <Grid item>
                <CircularProgress />
            </Grid>
        </Grid>
    );
}
