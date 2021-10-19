import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import React from 'react';
import { useCallback } from 'react';
import BWMRoot from '../../common/react/BWMRoot';

const useStyles = makeStyles(() => ({
    dialogTitleRoot: {
        paddingLeft: 60,
    },
    dialogTitleIcon: {
        position: 'absolute',
        top: 0,
        left: 12,
        padding: 6,
        width: 48,
        height: 48,
    },
}));

export type AutoLoginPageProps = {
    error?: string;
    progress: number;
};

export default React.memo(function AutoLoginPage(props: AutoLoginPageProps) {
    return (
        <BWMRoot>
            <AutoLoginPageContent {...props} />
        </BWMRoot>
    );
});

const AutoLoginPageContent = React.memo(function AutoLoginPageContent(props: AutoLoginPageProps) {
    const classes = useStyles();

    const handleGotoFallbackPageClick = useCallback(() => {
        location.replace(
            'https://wsdmoodle.waseda.jp/auth/saml2/login.php?wants=https%3A%2F%2Fwsdmoodle.waseda.jp%2F&idp=fcc52c5d2e034b1803ea1932ae2678b0&passive=off'
        );
    }, []);

    return (
        <Dialog hideBackdrop open maxWidth="xs" fullWidth>
            <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                <img src="/res/images/icon.svg" className={classes.dialogTitleIcon} />
                <Typography variant="h6">{browser.i18n.getMessage('appName')}</Typography>
            </DialogTitle>
            <DialogContent>
                {props.error !== undefined ? (
                    <Alert severity="error" variant="filled">
                        {browser.i18n.getMessage('autoLoginFailedMessage')}
                    </Alert>
                ) : (
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <CircularProgressWithLabel value={props.progress * 100} />
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">{browser.i18n.getMessage('autoLoginPageMessage')}</Typography>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                {props.error && (
                    <Button color="primary" onClick={handleGotoFallbackPageClick}>
                        {browser.i18n.getMessage('autoLoginFallbackButtonText')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
});

function CircularProgressWithLabel(props: CircularProgressProps) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                    props.value ?? 0
                )}%`}</Typography>
            </Box>
        </Box>
    );
}
