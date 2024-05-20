import { ActionEvent } from "@/common/api/moodle/calendar";
import { Alert, AlertTitle, Button, Stack, Typography } from "@mui/material";
import React, { FC, Fragment } from "react";
import { TimelineEvent } from "./TimelineEvent";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import { isSameDay as dateFnsIsSameDay, isPast, isSameYear } from "date-fns";
import { DateTimeFormat } from "@/common/util/intl";
import ReactMarkdown from "react-markdown";

export type TimelineEventListProps = {
    events: ActionEvent[];
    reloadTimeline: () => void;
    variant: "popup" | "dashboard";
};

const dateFormat = new DateTimeFormat({
    month: "short",
    day: "numeric",
    weekday: "short",
});
const dateWithYearFormat = new DateTimeFormat({
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
});

export const TimelineEventList: FC<TimelineEventListProps> = (props) => {
    const [dateBorderOffset] = useConfig(ConfigKey.TimelineDateBorderOffset);
    const showWarning = !useConfig(ConfigKey.HiddenTips)[0].includes("timeline_warning");

    /**
     * 日付の境界のオフセットを考慮した isSameDay
     *
     * @param date1 - 日付1
     * @param date2 - 日付2
     * @returns 日付1と日付2が同じ日付かどうか
     */
    function isSameDay(date1?: Date | number, date2?: Date | number) {
        if (!date1 || !date2) {
            return false;
        }

        const d1 = new Date(date1);
        const d2 = new Date(date2);
        d1.setMilliseconds(d1.getMilliseconds() - dateBorderOffset);
        d2.setMilliseconds(d2.getMilliseconds() - dateBorderOffset);

        return dateFnsIsSameDay(date1, date2);
    }

    return (
        <Stack p={props.variant === "popup" ? 1 : 0} sx={{ overflowY: "auto" }}>
            {showWarning && <Warning />}

            {props.events.map((event, i) => {
                const prevEventDate = i > 0 ? props.events[i - 1].timesort * 1000 : 0;
                const eventDate = event.timesort * 1000;
                return (
                    <Fragment key={event.id}>
                        {!isSameDay(eventDate - dateBorderOffset, prevEventDate - dateBorderOffset) && (
                            <Typography
                                variant="body2"
                                color={isPast(eventDate) ? "error.main" : "text.primary"}
                                fontWeight="bold"
                                sx={{ mt: 0.5 }}
                            >
                                {isSameYear(eventDate, new Date())
                                    ? dateFormat.format(eventDate - dateBorderOffset)
                                    : dateWithYearFormat.format(eventDate - dateBorderOffset)}
                            </Typography>
                        )}
                        <TimelineEvent event={event} reloadTimeline={props.reloadTimeline} variant={props.variant} />
                    </Fragment>
                );
            })}
        </Stack>
    );
};

const Warning = () => {
    return (
        <Alert
            variant="outlined"
            severity="warning"
            action={
                <Button
                    sx={{ alignSelf: "center" }}
                    onClick={() => {
                        setConfig(ConfigKey.HiddenTips, [...getConfig(ConfigKey.HiddenTips), "timeline_warning"]);
                    }}
                >
                    {browser.i18n.getMessage("hide_tip")}
                </Button>
            }
            sx={{
                flexWrap: "wrap",
                "& .MuiAlert-message": {
                    maxWidth: "calc(100% - 34px)",
                },
                "& .MuiAlert-action": {
                    paddingTop: 0,
                },
            }}
        >
            <AlertTitle>{browser.i18n.getMessage("timeline_warning_title")}</AlertTitle>
            <ReactMarkdown>{browser.i18n.getMessage("timeline_warning")}</ReactMarkdown>
        </Alert>
    );
};
