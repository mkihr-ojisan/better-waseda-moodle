import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
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
            <Hidden xsDown implementation="css">
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
                    <>
                        {section.divider && <Divider />}
                        <ListItem
                            button
                            key={section.title}
                            onClick={() => handleClick(i)}
                            selected={i === props.selectedSectionIndex}
                        >
                            <ListItemIcon>
                                <section.Icon />
                            </ListItemIcon>
                            <ListItemText primary={browser.i18n.getMessage(section.title)} />
                        </ListItem>
                    </>
                ))}
            </List>
        </>
    );
}
