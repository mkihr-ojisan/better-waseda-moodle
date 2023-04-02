import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@mui/material";
import React, { FC, Fragment } from "react";
import { OptionsPageSection, useOptionsPageContext } from "./OptionsPage";

export type OptionsPageDrawerProps = {
    sections: OptionsPageSection[];
    drawerWidth: number;
};

export const OptionsPageDrawer: FC<OptionsPageDrawerProps> = ({ sections, drawerWidth }) => {
    const context = useOptionsPageContext();

    const handleClickSection = (sectionId: string) => {
        context.setUserSelectedSection(sectionId);
        context.setDrawerOpen(false);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {sections.map((section) => (
                    <Fragment key={section.id}>
                        {section.divider && <Divider />}
                        <ListItem disablePadding onClick={() => handleClickSection(section.id)}>
                            <ListItemButton selected={context.currentSection === section.id}>
                                <ListItemIcon>
                                    <section.Icon />
                                </ListItemIcon>
                                <ListItemText primary={browser.i18n.getMessage(section.title)} />
                            </ListItemButton>
                        </ListItem>
                    </Fragment>
                ))}
            </List>
        </div>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
            <Drawer
                variant="temporary"
                open={context.drawerOpen}
                onClose={() => context.setDrawerOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};
