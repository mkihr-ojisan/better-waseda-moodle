import Grid from '@mui/material/Grid';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
/*import AddIcon from '@mui/icons-material/Add';
import { openAddToDoItemPage } from '../../common/todo-list/todo';*/

const useStyles = makeStyles(() => ({
    root: {
        position: 'relative',
        zIndex: 2,
    },
    icon: {
        padding: 9,
        width: 48,
        height: 48,
    },
    iconImg: {
        width: 30,
        height: 30,
    },
    spacer: {
        flexGrow: 1,
    },
    progress: {
        width: 48,
        height: 48,
        padding: 12,
    },
}));

export type HeaderProps = {
    loading: boolean;
    onRefreshListRequest: () => void;
};

export default React.memo(function Header(props: HeaderProps) {
    const classes = useStyles();

    const handleSettingsButtonClick = useCallback(() => {
        browser.runtime.openOptionsPage();
        window.close();
    }, []);

    /*const handleAddButtonClick = useCallback(() => {
        openAddToDoItemPage();
    }, []);*/

    return (
        <Paper square elevation={5} className={classes.root}>
            <Grid container alignItems="center">
                {props.loading ? (
                    <Grid container className={classes.progress}>
                        <CircularProgress size={24} />
                    </Grid>
                ) : (
                    <IconButton
                        onClick={props.onRefreshListRequest}
                        title={browser.i18n.getMessage('popupRefreshList')}
                        size="large"
                    >
                        <RefreshIcon />
                    </IconButton>
                )}
                {/*<Grid item>
                    <IconButton
                        title={browser.i18n.getMessage('popupAddButtonTitle')}
                        onClick={handleAddButtonClick}
                        size="large"
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>*/}
                <Grid item className={classes.spacer}></Grid>
                <Grid item>
                    <IconButton
                        title={browser.i18n.getMessage('popupSettingsButtonTitle')}
                        onClick={handleSettingsButtonClick}
                        size="large"
                    >
                        <SettingsIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    );
});
