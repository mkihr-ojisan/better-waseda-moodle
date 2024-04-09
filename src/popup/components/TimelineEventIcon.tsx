import { ActionEvent } from "@/common/api/moodle/calendar";
import { Box, useTheme } from "@mui/material";
import React, { FC, useMemo } from "react";
import EventIcon from "@mui/icons-material/Event";

export type TimelineEventIconProps = {
    event: ActionEvent;
};

export const TimelineEventIcon: FC<TimelineEventIconProps> = (props) => {
    const theme = useTheme();

    // よくわかりません
    const backgroundColor = useMemo(() => {
        if (theme.palette.mode === "light") {
            switch (props.event.purpose) {
                case "administration":
                    return "#5d63f6";
                case "assessment":
                    return "#eb66a2";
                case "collaboration":
                    return "#f7634d";
                case "communication":
                    return "#11a676";
                case "content":
                    return "#399be2";
                case "interface":
                    return "#a378ff";
                default:
                    return "transparent";
            }
        } else {
            switch (props.event.purpose) {
                case "administration":
                    return "rgb(8, 13, 146)";
                case "assessment":
                    return "rgb(137, 18, 72)";
                case "collaboration":
                    return "rgb(156, 26, 7)";
                case "communication":
                    return "rgb(14, 133, 94)";
                case "content":
                    return "rgb(24, 105, 163)";
                case "interface":
                    return "rgb(42, 0, 132)";
                default:
                    return "transparent";
            }
        }
    }, [props.event.purpose, theme.palette.mode]);

    const invert = useMemo(() => {
        if (theme.palette.mode === "light") {
            return false;
        }
        if (props.event.purpose === "none") {
            return false;
        }
        if (props.event.icon?.component === "questionnaire") {
            return false;
        }
        return true;
    }, [props.event.icon?.component, props.event.purpose, theme.palette.mode]);

    return (
        <Box
            component="div"
            sx={{
                width: "100%",
                height: "100%",
                padding: 0.5,
                borderRadius: "4px",
                backgroundColor,
            }}
        >
            {props.event.icon?.component && props.event.icon?.key ? (
                <Box
                    component="img"
                    src={`https://wsdmoodle.waseda.jp/theme/image.php/boost/${props.event.icon.component}/1680027354/${props.event.icon.key}`}
                    sx={{
                        width: "100%",
                        height: "100%",
                        filter: invert ? "invert(1)" : "none",
                    }}
                />
            ) : (
                <EventIcon />
            )}
        </Box>
    );
};
