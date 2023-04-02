import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React, { FC } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useOptionsPageContext } from "./OptionsPage";

export const OptionsPageAppBar: FC = () => {
    const context = useOptionsPageContext();

    return (
        <AppBar position="fixed" sx={{ zIndex: 1000000 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={() => context.setDrawerOpen((prev) => !prev)}
                    sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {browser.i18n.getMessage("options_page_title")}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
