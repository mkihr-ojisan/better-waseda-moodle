import { ActionEvent } from "@/common/api/moodle/calendar";
import { Stack, Typography } from "@mui/material";
import React, { FC, Fragment } from "react";
import { TimelineEvent } from "./TimelineEvent";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";
import { isSameDay as dateFnsIsSameDay, isPast, isSameYear } from "date-fns";
import { DateTimeFormat } from "@/common/util/intl";

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
