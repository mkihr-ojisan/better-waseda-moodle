import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import makeStyles from '@mui/styles/makeStyles';

type Props = {
    onDrawerOpen: () => void;
};

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));

export default React.memo(function OptionsPageAppBar(props: Props) {
    const classes = useStyles();

    return (
        <AppBar position="fixed">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.onDrawerOpen}
                    className={classes.menuButton}
                    size="large"
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    {browser.i18n.getMessage('optionsPageTitle')}
                </Typography>
            </Toolbar>
        </AppBar>
    );
});
