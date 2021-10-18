import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { Fragment } from 'react';
import { OPTIONS_PAGE_DRAWER_WIDTH, OPTIONS_PAGE_SECTIONS } from './OptionsPage';

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: OPTIONS_PAGE_DRAWER_WIDTH,
            flexShrink: 0,
            zIndex: 1000,
        },
    },
    drawerPaper: {
        width: OPTIONS_PAGE_DRAWER_WIDTH,
    },
}));

type Props = {
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    selectedSectionIndex: number;
    doScrollToSection: (index: number) => void;
};

export default React.memo(function OptionsPageDrawer(props: Props) {
    const theme = useTheme();
    const classes = useStyles();

    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
                <Drawer
                    container={document.body}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={props.drawerOpen}
                    onClose={props.onCloseDrawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <OptionsPageDrawerContent {...props} />
                </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    <OptionsPageDrawerContent {...props} />
                </Drawer>
            </Hidden>
        </nav>
    );
});

function OptionsPageDrawerContent(props: Props) {
    const classes = useStyles();

    const handleClick = (index: number) => {
        props.doScrollToSection(index);
        props.onCloseDrawer();
    };

    return (
        <>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {OPTIONS_PAGE_SECTIONS.map((section, i) => (
                    <Fragment key={section.name}>
                        {section.divider && <Divider />}
                        <ListItem button onClick={() => handleClick(i)} selected={i === props.selectedSectionIndex}>
                            <ListItemIcon>
                                <section.Icon />
                            </ListItemIcon>
                            <ListItemText primary={browser.i18n.getMessage(section.title)} />
                        </ListItem>
                    </Fragment>
                ))}
            </List>
        </>
    );
}
