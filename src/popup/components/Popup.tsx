import { useAsyncGenerator } from "@/common/react/hooks/useAsyncGenerator";
import { call } from "@/common/util/messenger/client";
import { Box, Typography } from "@mui/material";
import React, { FC, useCallback, useEffect } from "react";
import { PopupHeader } from "./PopupHeader";
import { TimelineEventList } from "./TimelineEventList";
import { useNotify } from "@/common/react/notification";
import { errorToString } from "@/common/error";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export const Popup: FC = () => {
    const { value: events, reload, state, error } = useAsyncGenerator(() => call("fetchMoodleTimeline"), []);

    const handleForceReloadTimeline = useCallback(async () => {
        await call("invalidateMoodleTimelineCache");
        reload();
    }, [reload]);

    const notify = useNotify();
    useEffect(() => {
        if (error) {
            notify({ message: errorToString(error), type: "error" });
        }
    }, [error, notify, state]);

    useEffect(() => {
        if (state === "done") {
            call("updateBadge");
        }
    }, [state]);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateRows: "48px 1fr",
                width: "100%",
                height: "100%",
            }}
        >
            <PopupHeader forceReloadTimeline={handleForceReloadTimeline} isTimelineLoading={state !== "done"} />

            {(!events || events.length === 0) && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 8,
                        padding: 16,
                    }}
                >
                    {state === "done" && <TaskAltIcon sx={{ fontSize: 48 }} />}
                    <Typography variant="body1">
                        {browser.i18n.getMessage(state === "done" ? "timeline_empty" : "timeline_loading")}
                    </Typography>
                </div>
            )}
            {events && events.length > 0 && <TimelineEventList events={events} reloadTimeline={reload} />}
        </Box>
    );
};
