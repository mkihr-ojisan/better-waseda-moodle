import { CourseWithSetHidden } from "@/common/course/course";
import {
    Box,
    Chip,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
    alpha,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CourseCardMenu } from "./CourseCardMenu";
import { useCourseOverviewContext } from "./CourseOverview";
import { unique } from "@/common/util/array";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";
import VideocamIcon from "@mui/icons-material/Videocam";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { DEFAULT_COURSE_COLOR } from "@/common/course/course-color";
import NoteIcon from "@mui/icons-material/Note";
import MoreVert from "@mui/icons-material/MoreVert";

export type CourseCardProps = {
    course: CourseWithSetHidden;
    tags?: string[];
    /** 指定した場合はこの教室が表示される。指定しない場合は科目に設定されたすべての教室がカンマ区切りで表示される */
    classroom?: string;
    height: "fixed" | "fill-parent";
    inTimetable?: boolean;
};

export const CourseCard = memo(function CourseCard(props: CourseCardProps) {
    const theme = useTheme();
    const compact = useMediaQuery(theme.breakpoints.down("lg")) && props.inTimetable;
    const veryCompact = useMediaQuery(theme.breakpoints.down("sm")) && props.inTimetable;
    const context = useCourseOverviewContext();
    const [appearanceOptions] = useConfig(ConfigKey.CourseOverviewAppearanceOptions);

    const color = useConfig(ConfigKey.CourseColor)[0][props.course.id] ?? DEFAULT_COURSE_COLOR;
    const deliveryMethod = useConfig(ConfigKey.CourseDeliveryMethods)[0][props.course.id];

    const courseNameOverride = useConfig(ConfigKey.CourseNameOverrides)[0][props.course.id];
    const courseName = courseNameOverride ?? props.course.name;

    const classroom = useMemo(() => {
        if (props.classroom !== undefined) return props.classroom;
        const timetable = context.timetableData[props.course.id];
        if (!timetable) return undefined;
        return unique(timetable.map((t) => t.classroom)).join(", ");
    }, [context.timetableData, props.classroom, props.course.id]);

    const streamingURL = useConfig(ConfigKey.CourseStreamingURLs)[0][props.course.id];

    const note = useConfig(ConfigKey.CourseNotes)[0][props.course.id];

    const showDeliveryMethod = !!deliveryMethod && appearanceOptions.showCourseDeliveryMethod;
    const showTags = !!props.tags && props.tags.length > 0 && appearanceOptions.showCourseTags;

    // カードの高さに合わせてタイトルの行数を調整する
    const rootElem = useRef<HTMLDivElement>(null);
    const [courseTitleLineClamp, setCourseTitleLineClamp] = useState(3);
    useEffect(() => {
        if (!rootElem.current) return;

        const observer = new ResizeObserver(() => {
            if (!rootElem.current) return;
            const rootHeight = rootElem.current.getBoundingClientRect().height;
            let lines = Math.floor((rootHeight - 16) / (24 * (compact ? 0.8 : 1)));
            if (showDeliveryMethod) lines--;
            if (showTags) lines--;
            setCourseTitleLineClamp(Math.max(1, Math.floor(lines)));
        });
        observer.observe(rootElem.current);

        return () => {
            observer.disconnect();
        };
    }, [showDeliveryMethod, showTags, compact]);

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [menuAnchorPosition, setMenuAnchorPosition] = useState<{ top: number; left: number }>();
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setMenuOpen(true);
        setMenuAnchorPosition({ top: event.clientY, left: event.clientX });
    };

    return (
        <Paper
            sx={{
                borderLeft: appearanceOptions.showCourseColor ? `${theme.spacing(1)} solid ${color}` : "none",
                display: "flex",
                flexDirection: "column",
                flexShrink: 2,
                alignItems: "flex-start",
                width: "100%",
                height: props.height === "fixed" ? "9em" : "100%",
                minHeight: 56,
                textAlign: "left",
                [theme.breakpoints.up("md")]: {
                    padding: theme.spacing(1),
                },
                [theme.breakpoints.down("lg")]: {
                    padding: theme.spacing(props.inTimetable ? 0.5 : 1),
                },
            }}
            ref={rootElem}
            onContextMenu={appearanceOptions.showCourseNote && veryCompact ? handleContextMenu : undefined}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateRows: "1fr",

                    [theme.breakpoints.up("md")]: {
                        gridTemplateColumns:
                            (appearanceOptions.showCourseMenu || appearanceOptions.showCourseNote) && !veryCompact
                                ? "minmax(0, 1fr) 32px"
                                : "minmax(0, 1fr)",
                    },
                    [theme.breakpoints.down("lg")]: {
                        gridTemplateColumns:
                            (appearanceOptions.showCourseMenu || appearanceOptions.showCourseNote) && !veryCompact
                                ? "minmax(0, 1fr) " + (props.inTimetable ? "24px" : "32px")
                                : "minmax(0, 1fr)",
                    },
                }}
            >
                <div>
                    <Typography
                        component={props.course.url ? "a" : "span"}
                        href={props.course.url}
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: courseTitleLineClamp,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 0,
                            [theme.breakpoints.down("lg")]: {
                                fontSize: props.inTimetable ? "0.8em" : "1em",
                            },
                        }}
                        color="text.primary"
                        title={courseName}
                    >
                        {props.course.hidden && <VisibilityOff fontSize="small" sx={{ color: "text.secondary" }} />}
                        {courseName}
                    </Typography>
                </div>
                <div>
                    {appearanceOptions.showCourseMenu && (
                        <CourseCardMenu
                            course={props.course}
                            inTimetable={props.inTimetable}
                            open={menuOpen}
                            onClose={() => setMenuOpen(false)}
                            {...(veryCompact
                                ? {
                                      anchorReference: "anchorPosition",
                                      anchorPosition: menuAnchorPosition,
                                  }
                                : { anchorEl: menuAnchorEl })}
                        />
                    )}

                    {(appearanceOptions.showCourseMenu || appearanceOptions.showCourseNote) && !veryCompact && (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            {appearanceOptions.showCourseMenu && (
                                <>
                                    <IconButton
                                        size="small"
                                        onClick={(event) => {
                                            setMenuOpen(true);
                                            setMenuAnchorEl(event.currentTarget);
                                        }}
                                        sx={{
                                            [theme.breakpoints.down("lg")]: props.inTimetable
                                                ? { width: 24, height: 24 }
                                                : undefined,
                                        }}
                                    >
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                            {appearanceOptions.showCourseNote && note && (
                                <Tooltip
                                    title={
                                        <Typography variant="body1" sx={{ whiteSpace: "break-spaces" }}>
                                            {note}
                                        </Typography>
                                    }
                                >
                                    <IconButton
                                        size="small"
                                        sx={{
                                            [theme.breakpoints.down("lg")]: props.inTimetable
                                                ? { width: 24, height: 24 }
                                                : undefined,
                                        }}
                                    >
                                        <NoteIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    )}
                </div>
            </Box>

            <Box sx={{ flexGrow: "1" }} />

            {showDeliveryMethod &&
                (deliveryMethod === "face_to_face" ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            [theme.breakpoints.down("lg")]: {
                                fontSize: props.inTimetable ? "0.8em" : "1em",
                            },
                        }}
                        title={
                            classroom
                                ? browser.i18n.getMessage("course_overview_course_face_to_face") + " " + classroom
                                : browser.i18n.getMessage("course_overview_course_face_to_face")
                        }
                    >
                        <PeopleAltIcon fontSize={compact ? "small" : "medium"} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {classroom || browser.i18n.getMessage("course_overview_course_face_to_face")}
                        </span>
                    </Typography>
                ) : deliveryMethod === "realtime_streaming" ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            [theme.breakpoints.down("lg")]: {
                                fontSize: props.inTimetable ? "0.8em" : "1em",
                            },
                        }}
                        title={browser.i18n.getMessage("course_overview_course_realtime_streaming")}
                    >
                        <VideocamIcon fontSize={compact ? "small" : "medium"} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {streamingURL ? (
                                <Box
                                    component="a"
                                    href={streamingURL}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {browser.i18n.getMessage("course_overview_course_realtime_streaming")}
                                </Box>
                            ) : (
                                browser.i18n.getMessage("course_overview_course_realtime_streaming")
                            )}
                        </span>
                    </Typography>
                ) : deliveryMethod === "on_demand" ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            [theme.breakpoints.down("lg")]: {
                                fontSize: props.inTimetable ? "0.8em" : "1em",
                            },
                        }}
                        title={browser.i18n.getMessage("course_overview_course_on_demand")}
                    >
                        <OndemandVideoIcon fontSize={compact ? "small" : "medium"} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {browser.i18n.getMessage("course_overview_course_on_demand")}
                        </span>
                    </Typography>
                ) : null)}

            {showTags && (
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        ":after": {
                            content: '""',
                            background: `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0)} 0%, ${alpha(
                                theme.palette.background.paper,
                                0
                            )} 90%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                            width: "100%",
                            height: "1.5em",
                            display: "block",
                            position: "absolute",
                            pointerEvents: "none",
                        },
                    }}
                >
                    {props.tags?.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                    ))}
                </Stack>
            )}
        </Paper>
    );
});
