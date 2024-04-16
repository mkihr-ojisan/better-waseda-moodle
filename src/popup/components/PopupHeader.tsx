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
        <Paper square sx={{ zIndex: 1 }} elevation={5}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src="/res/images/icon.svg"
                    style={{ width: "48px", height: "48px", boxSizing: "border-box", padding: "8px" }}
                />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {browser.runtime.getManifest().name}
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
