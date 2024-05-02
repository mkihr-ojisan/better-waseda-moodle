import { ActionEvent } from "@/common/api/moodle/calendar";
import {
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { DateTimeFormat } from "@/common/util/intl";
import { TimelineEventIcon } from "./TimelineEventIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNotify } from "@/common/react/notification";
import LaunchIcon from "@mui/icons-material/Launch";
import { useConfig } from "@/common/config/useConfig";
import { isSameDay } from "date-fns";

export type TimelineEventProps = {
    event: ActionEvent;
    reloadTimeline: () => void;
    variant: "popup" | "dashboard";
};

const timeFormat = new DateTimeFormat({
    hour: "numeric",
    minute: "numeric",
});

export const TimelineEvent: FC<TimelineEventProps> = (props) => {
    const theme = useTheme();
    const notify = useNotify();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    const [dateBorderOffset] = useConfig(ConfigKey.TimelineDateBorderOffset);

    const handleLinkClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (props.variant === "popup") {
                const href = (event.target as HTMLAnchorElement).href;
                if (href) {
                    window.open(href, "_blank");
                    window.close();
                    event.preventDefault();
                }
            }
        },
        [props.variant]
    );

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleClickAction = useCallback(() => {
        if (!props.event.action?.url) return;
        switch (props.variant) {
            case "popup":
                window.open(props.event.action.url, "_blank");
                window.close();
                break;
            case "dashboard":
                location.href = props.event.action.url;
                break;
        }
        handleCloseMenu();
    }, [handleCloseMenu, props.event.action?.url, props.variant]);

    const showHideMessage = () => {
        if (getConfig(ConfigKey.HiddenTips).includes(`hide_timeline_event_${props.variant}`)) return;
        notify({
            type: "info",
            message: browser.i18n.getMessage("timeline_hide_message"),
            action: browser.i18n.getMessage("hide_tip_long"),
            onAction: () => {
                setConfig(ConfigKey.HiddenTips, [
                    ...getConfig(ConfigKey.HiddenTips),
                    `hide_timeline_event_${props.variant}`,
                ]);
            },
            closeOnAction: true,
        });
    };

    const handleHideEvent = async () => {
        if (!props.event.id) return;
        await setConfig(ConfigKey.TimelineHiddenEventIds, [
            ...getConfig(ConfigKey.TimelineHiddenEventIds),
            props.event.id,
        ]);
        handleCloseMenu();
        props.reloadTimeline();
        showHideMessage();
    };
    const handleHideCourse = async () => {
        if (!props.event.course?.id) return;
        await setConfig(ConfigKey.TimelineHiddenCourses, [
            ...getConfig(ConfigKey.TimelineHiddenCourses),
            props.event.course.id.toString(),
        ]);
        handleCloseMenu();
        props.reloadTimeline();
        showHideMessage();
    };
    const handleHideType = async () => {
        if (!props.event.modulename) return;
        await setConfig(ConfigKey.TimelineHiddenModuleNames, [
            ...getConfig(ConfigKey.TimelineHiddenModuleNames),
            props.event.modulename,
        ]);
        handleCloseMenu();
        props.reloadTimeline();
        showHideMessage();
    };

    const denseMenu = props.variant === "popup";
    const isNextDay = !isSameDay(props.event.timesort * 1000, props.event.timesort * 1000 - dateBorderOffset);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                height: 48,
                borderBottom: 1,
                borderBottomStyle: "solid",
                borderBottomColor: theme.palette.divider,
                gap: 8,
            }}
        >
            <div
                style={{
                    width: timeFormat.resolvedOptions().hour12 ? 64 : 48,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Typography variant="caption" textAlign="center">
                    {isNextDay
                        ? browser.i18n.getMessage("timeline_next_day", timeFormat.format(props.event.timesort * 1000))
                        : timeFormat.format(props.event.timesort * 1000)}
                </Typography>
            </div>
            <div style={{ width: 32, height: 32, flexShrink: 0 }}>
                <TimelineEventIcon event={props.event} />
            </div>

            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {props.event.course && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        component="a"
                        href={props.event.course.viewurl}
                        onClick={handleLinkClick}
                        title={props.event.course.fullname}
                        sx={{
                            display: "inline-block",
                            width: "100%",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            "&[href]:hover": {
                                textDecoration: "underline",
                                color: (theme) => theme.palette.primary.main,
                            },
                        }}
                    >
                        {props.event.course.fullname}
                    </Typography>
                )}
                <Typography
                    variant="body2"
                    color="textPrimary"
                    component="a"
                    href={props.event.url}
                    onClick={handleLinkClick}
                    title={props.event.name}
                    sx={{
                        display: "inline-block",
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textDecoration: "none",
                        "&[href]:hover": {
                            textDecoration: "underline",
                            color: (theme) => theme.palette.primary.main,
                        },
                    }}
                >
                    {props.event.name}
                </Typography>
            </div>

            {!isMobile && props.event.action && props.event.action.actionable && (
                <Button
                    variant="outlined"
                    LinkComponent="a"
                    href={props.event.action.url}
                    sx={{
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                    }}
                >
                    {props.event.action.name}
                </Button>
            )}

            <div style={{ flexShrink: 0 }}>
                <IconButton size="small" onClick={handleOpenMenu}>
                    <MoreVertIcon />
                </IconButton>
            </div>

            <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleCloseMenu}>
                {isMobile &&
                    props.event.action &&
                    props.event.action.actionable && [
                        <MenuItem dense={denseMenu} key="menu" onClick={handleClickAction}>
                            <ListItemIcon>
                                {props.variant === "popup" && <LaunchIcon />}
                                {props.variant === "dashboard" && <ArrowForwardIcon />}
                            </ListItemIcon>
                            <ListItemText>{props.event.action.name}</ListItemText>
                        </MenuItem>,
                        <Divider key="divider" />,
                    ]}
                <MenuItem dense={denseMenu} onClick={handleHideEvent}>
                    <ListItemIcon>
                        <VisibilityOffIcon />
                    </ListItemIcon>
                    <ListItemText>{browser.i18n.getMessage("timeline_hide_event")}</ListItemText>
                </MenuItem>
                {props.event.course && (
                    <MenuItem dense={denseMenu} onClick={handleHideCourse}>
                        <ListItemIcon />
                        <ListItemText>{browser.i18n.getMessage("timeline_hide_course")}</ListItemText>
                    </MenuItem>
                )}
                {props.event.modulename && (
                    <MenuItem dense={denseMenu} onClick={handleHideType}>
                        <ListItemIcon />
                        <ListItemText>{browser.i18n.getMessage("timeline_hide_type")}</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};
