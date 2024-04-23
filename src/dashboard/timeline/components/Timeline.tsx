import { errorToString } from "@/common/error";
import { useAsyncGenerator } from "@/common/react/hooks/useAsyncGenerator";
import { useNotify } from "@/common/react/notification";
import { call } from "@/common/util/messenger/client";
import { CircularProgress, Typography } from "@mui/material";
import React, { FC, useEffect } from "react";
import { TimelineEventList } from "./TimelineEventList";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export const Timeline: FC = () => {
    const { value: events, reload, error } = useAsyncGenerator(() => call("fetchMoodleTimeline"), []);
    const notify = useNotify();

    useEffect(() => {
        if (error) {
            notify({ message: errorToString(error), type: "error" });
        }
    }, [error, notify]);

    return !events ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
        </div>
    ) : events.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 8, padding: 16 }}>
            <TaskAltIcon sx={{ fontSize: 48 }} />
            <Typography variant="body1">{browser.i18n.getMessage("timeline_empty")}</Typography>
        </div>
    ) : (
        <TimelineEventList events={events} reloadTimeline={reload} />
    );
};
