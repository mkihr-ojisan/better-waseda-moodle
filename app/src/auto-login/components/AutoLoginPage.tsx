import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useCallback } from 'react';
import BWMThemePrefersColorScheme from '../../common/react/theme/BWMThemePrefersColorScheme';

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
        <BWMThemePrefersColorScheme>
            <AutoLoginPageContent {...props} />
        </BWMThemePrefersColorScheme>
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
        <>
            <CssBaseline />
            <Dialog hideBackdrop open maxWidth="xs" fullWidth>
                <DialogTitle disableTypography classes={{ root: classes.dialogTitleRoot }}>
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
                                <Typography variant="body1">
                                    {browser.i18n.getMessage('autoLoginPageMessage')}
                                </Typography>
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
        </>
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
