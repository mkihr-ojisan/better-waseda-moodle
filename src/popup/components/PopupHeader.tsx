import { CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import React, { FC, useCallback } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";

export type PopupHeaderProps = {
    forceReloadTimeline: () => void;
    isTimelineLoading: boolean;
};

export const PopupHeader: FC<PopupHeaderProps> = (props) => {
    const handleClickSettingsButton = useCallback(() => {
        browser.runtime.openOptionsPage();
        window.close();
    }, []);

    return (
        <Paper square sx={{ p: 1, zIndex: 1 }} elevation={5}>
            <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ m: 1, flexGrow: 1 }} fontWeight="bold">
                    {browser.i18n.getMessage("timeline_title")}
                </Typography>
                {props.isTimelineLoading ? (
                    <CircularProgress size={24} sx={{ margin: 1 }} />
                ) : (
                    <IconButton onClick={props.forceReloadTimeline} title={browser.i18n.getMessage("timeline_reload")}>
                        <RefreshIcon />
                    </IconButton>
                )}
                <IconButton title={browser.i18n.getMessage("options_page_title")} onClick={handleClickSettingsButton}>
                    <SettingsIcon />
                </IconButton>
            </div>
        </Paper>
    );
};
