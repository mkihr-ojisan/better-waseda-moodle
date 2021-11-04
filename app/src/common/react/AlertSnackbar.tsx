import { AlertColor } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getErrorMessage } from '../util/util';

export type AlertSnackbarProps =
    | {
          message: string | undefined;
          severity: AlertColor | undefined;
      }
    | {
          error: unknown | undefined;
      };

export default React.memo(function AlertSnackbar(props: AlertSnackbarProps) {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (('error' in props && props.error) || ('message' in props && props.message && props.severity)) {
            setOpen(true);
        }
    }, [props]);

    return (
        <Snackbar autoHideDuration={6000} open={open} onClose={handleClose}>
            {'error' in props && props.error ? (
                <Alert severity="error" variant="filled">
                    {getErrorMessage(props.error)}
                </Alert>
            ) : 'message' in props && props.message && props.severity ? (
                <Alert severity={props.severity} variant="filled">
                    {props.message}
                </Alert>
            ) : undefined}
        </Snackbar>
    );
});
