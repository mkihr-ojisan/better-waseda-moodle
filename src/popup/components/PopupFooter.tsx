import { CircularProgress, Grid, IconButton, Paper } from "@mui/material";
import React, { FC, useCallback } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";

export type PopupFooterProps = {
    forceReloadTimeline: () => void;
    isTimelineLoading: boolean;
};

export const PopupFooter: FC<PopupFooterProps> = (props) => {
    const handleClickSettingsButton = useCallback(() => {
        browser.runtime.openOptionsPage();
        window.close();
    }, []);

    return (
        <Paper
            square
            elevation={5}
            sx={{
                position: "relative",
                zIndex: 2,
            }}
        >
            <Grid container alignItems="center">
                {props.isTimelineLoading ? (
                    <Grid
                        container
                        sx={{
                            width: 48,
                            height: 48,
                            padding: "12px",
                        }}
                    >
                        <CircularProgress size={24} />
                    </Grid>
                ) : (
                    <IconButton
                        onClick={props.forceReloadTimeline}
                        title={browser.i18n.getMessage("timeline_reload")}
                        size="large"
                    >
                        <RefreshIcon />
                    </IconButton>
                )}
                <Grid item sx={{ flexGrow: 1 }} />
                <Grid item>
                    <IconButton
                        title={browser.i18n.getMessage("popupSettingsButtonTitle")}
                        onClick={handleClickSettingsButton}
                        size="large"
                    >
                        <SettingsIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    );
};
