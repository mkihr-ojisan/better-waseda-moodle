import { ActionEvent } from "@/common/api/moodle/calendar";
import {
    Box,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import { TimelineEventIcon } from "./TimelineEventIcon";
import { Center } from "@/common/react/Center";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LaunchIcon from "@mui/icons-material/Launch";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { DateTimeFormat } from "@/common/util/intl";

export type TimelineEventProps = {
    event: ActionEvent;
    reloadTimeline: () => void;
};

const timeFormat = new DateTimeFormat({
    hour: "numeric",
    minute: "numeric",
});

export const TimelineEvent: FC<TimelineEventProps> = (props) => {
    const handleLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        const href = (event.target as HTMLAnchorElement).href;
        if (href) {
            window.open(href, "_blank");
            window.close();
            event.preventDefault();
        }
    }, []);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleClickAction = useCallback(() => {
        if (!props.event.action?.url) return;
        window.open(props.event.action.url, "_blank");
        window.close();
    }, [props.event.action]);

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
        <Paper
            sx={{
                display: "grid",
                position: "relative",
                height: 48,
                gridTemplateColumns: "48px 1fr 48px",
            }}
        >
            <Box
                component="div"
                sx={{
                    width: 48,
                    height: 48,
                    padding: 1,
                }}
            >
                <TimelineEventIcon event={props.event} />
            </Box>
            <Grid
                container
                justifyContent="center"
                alignItems="flex-start"
                direction="column"
                sx={{
                    overflow: "hidden",
                    width: "100%",
                    flexWrap: "nowrap",
                }}
            >
                <Grid
                    container
                    sx={{
                        overflow: "hidden",
                        width: "100%",
                        flexWrap: "nowrap",
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
                                maxWidth: "100%",
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
                    <Grid item sx={{ flexGrow: 1 }} />
                    {props.event.timesort && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "inline-block",
                                maxWidth: "100%",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            {timeFormat.format(props.event.timesort * 1000)}
                        </Typography>
                    )}
                </Grid>
                <Typography
                    variant="body2"
                    color="textPrimary"
                    component="a"
                    href={props.event.url}
                    onClick={handleLinkClick}
                    title={props.event.name}
                    sx={{
                        display: "inline-block",
                        maxWidth: "100%",
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
            </Grid>
            <Center>
                <IconButton size="small" onClick={handleOpenMenu}>
                    <MoreVertIcon />
                </IconButton>
            </Center>

            <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleCloseMenu}>
                {props.event.action &&
                    props.event.action.actionable && [
                        <MenuItem dense onClick={handleClickAction} key="menu">
                            <ListItemIcon>
                                <LaunchIcon />
                            </ListItemIcon>
                            <ListItemText>{props.event.action.name}</ListItemText>
                        </MenuItem>,
                        <Divider key="divider" />,
                    ]}

                <MenuItem dense onClick={handleHideEvent}>
                    <ListItemIcon>
                        <VisibilityOffIcon />
                    </ListItemIcon>
                    <ListItemText>{browser.i18n.getMessage("timeline_hide_event")}</ListItemText>
                </MenuItem>
                {props.event.course && (
                    <MenuItem dense onClick={handleHideCourse}>
                        <ListItemIcon />
                        <ListItemText>{browser.i18n.getMessage("timeline_hide_course")}</ListItemText>
                    </MenuItem>
                )}
                {props.event.modulename && (
                    <MenuItem dense onClick={handleHideType}>
                        <ListItemIcon />
                        <ListItemText>{browser.i18n.getMessage("timeline_hide_type")}</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </Paper>
    );
};
