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
    alpha,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { DateTimeFormat } from "@/common/util/intl";
import { TimelineEventIcon } from "@/popup/components/TimelineEventIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export type TimelineEventProps = {
    event: ActionEvent;
    reloadTimeline: () => void;
};

const timeFormat = new DateTimeFormat({
    hour: "numeric",
    minute: "numeric",
});

export const TimelineEvent: FC<TimelineEventProps> = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    const textPrimaryColor = theme.palette.text.primary;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleClickAction = useCallback(() => {
        if (!props.event.action?.url) return;
        location.href = props.event.action.url;
        handleCloseMenu();
    }, [handleCloseMenu, props.event.action?.url]);

    const handleHideEvent = useCallback(async () => {
        if (!props.event.id) return;
        await setConfig(ConfigKey.TimelineHiddenEventIds, [
            ...getConfig(ConfigKey.TimelineHiddenEventIds),
            props.event.id,
        ]);
        handleCloseMenu();
        props.reloadTimeline();
    }, [handleCloseMenu, props]);
    const handleHideCourse = useCallback(async () => {
        if (!props.event.course?.id) return;
        await setConfig(ConfigKey.TimelineHiddenCourses, [
            ...getConfig(ConfigKey.TimelineHiddenCourses),
            props.event.course.id.toString(),
        ]);
        handleCloseMenu();
        props.reloadTimeline();
    }, [handleCloseMenu, props]);
    const handleHideType = useCallback(async () => {
        if (!props.event.modulename) return;
        await setConfig(ConfigKey.TimelineHiddenModuleNames, [
            ...getConfig(ConfigKey.TimelineHiddenModuleNames),
            props.event.modulename,
        ]);
        handleCloseMenu();
        props.reloadTimeline();
    }, [handleCloseMenu, props]);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                height: 48,
                borderBottom: `1px solid ${alpha(textPrimaryColor, 0.25)}`,
                gap: 8,
            }}
        >
            <div
                style={{
                    width: 48,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Typography variant="caption">{timeFormat.format(props.event.timesort * 1000)}</Typography>
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
                        <MenuItem key="menu" onClick={handleClickAction}>
                            <ListItemIcon>
                                <ArrowForwardIcon />
                            </ListItemIcon>
                            <ListItemText>{props.event.action.name}</ListItemText>
                        </MenuItem>,
                        <Divider key="divider" />,
                    ]}
                <MenuItem onClick={handleHideEvent}>
                    <ListItemIcon>
                        <VisibilityOffIcon />
                    </ListItemIcon>
                    <ListItemText>{browser.i18n.getMessage("timeline_hide_event")}</ListItemText>
                </MenuItem>
                {props.event.course && (
                    <MenuItem onClick={handleHideCourse}>
                        <ListItemIcon />
                        <ListItemText>{browser.i18n.getMessage("timeline_hide_course")}</ListItemText>
                    </MenuItem>
                )}
                {props.event.modulename && (
                    <MenuItem onClick={handleHideType}>
                        <ListItemIcon />
                        <ListItemText>{browser.i18n.getMessage("timeline_hide_type")}</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};
