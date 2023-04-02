import { Alert, Button } from "@mui/material";
import React, { FC } from "react";

export type NoTimetableDataTipProps = {
    onHide: () => void;
};

export const NoTimetableDataTip: FC<NoTimetableDataTipProps> = (props) => {
    return (
        <Alert
            variant="outlined"
            severity="info"
            action={
                <Button onClick={props.onHide} color="inherit" size="small" sx={{ whiteSpace: "nowrap" }}>
                    {browser.i18n.getMessage("hide_tip")}
                </Button>
            }
            sx={{
                mb: 1,
                ".MuiAlert-action": {
                    paddingTop: 0,
                    alignItems: "center",
                },
            }}
        >
            {browser.i18n.getMessage("course_overview_no_timetable_data_tip")}
        </Alert>
    );
};
