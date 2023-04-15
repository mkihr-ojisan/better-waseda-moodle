import { CourseWithSetHidden } from "@/common/course/course";
import { Box, Chip, IconButton, Paper, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
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

export type CourseCardProps = {
    course: CourseWithSetHidden;
    tags?: string[];
    /** 指定した場合はこの教室が表示される。指定しない場合は科目に設定されたすべての教室がカンマ区切りで表示される */
    classroom?: string;
    height: "fixed" | "fill-parent";
};

export const CourseCard = memo(function CourseCard(props: CourseCardProps) {
    const theme = useTheme();
    const context = useCourseOverviewContext();
    const [appearanceOptions] = useConfig(ConfigKey.CourseOverviewAppearanceOptions);

    const color = useConfig(ConfigKey.CourseColor)[0][props.course.id] ?? DEFAULT_COURSE_COLOR;
    const deliveryMethod = useConfig(ConfigKey.CourseDeliveryMethods)[0][props.course.id];

    const courseNameOverride = useConfig(ConfigKey.CourseNameOverrides)[0][props.course.id];
    const courseName = courseNameOverride ?? props.course.name;

    const classroom = useMemo(() => {
        if (props.classroom) return props.classroom;
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
            let lines = Math.floor((rootHeight - 16) / 24);
            if (showDeliveryMethod) lines--;
            if (showTags) lines--;
            setCourseTitleLineClamp(Math.max(1, Math.floor(lines)));
        });
        observer.observe(rootElem.current);

        return () => {
            observer.disconnect();
        };
    }, [showDeliveryMethod, showTags]);

    return (
        <Paper
            sx={{
                borderLeft: appearanceOptions.showCourseColor ? `${theme.spacing(1)} solid ${color}` : "none",
                display: "grid",
                gridTemplateColumns:
                    appearanceOptions.showCourseMenu || appearanceOptions.showCourseNote
                        ? "minmax(0, 1fr) 32px"
                        : "minmax(0, 1fr)",
                gridTemplateRows: "1fr",
                width: "100%",
                height: props.height === "fixed" ? "9em" : "100%",
                minHeight: 56,
                padding: theme.spacing(1),
                textAlign: "left",
            }}
            ref={rootElem}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 2,
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <Typography
                        component="a"
                        href={props.course.moodleUrl}
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: courseTitleLineClamp,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 0,
                        }}
                        color="text.primary"
                        title={courseName}
                    >
                        {props.course.hidden && <VisibilityOff fontSize="small" sx={{ color: "text.secondary" }} />}
                        {courseName}
                    </Typography>
                </div>

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
                            }}
                            title={classroom || browser.i18n.getMessage("course_overview_course_face_to_face")}
                        >
                            <PeopleAltIcon />
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
                            }}
                            title={browser.i18n.getMessage("course_overview_course_realtime_streaming")}
                        >
                            <VideocamIcon />
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
                            }}
                            title={browser.i18n.getMessage("course_overview_course_on_demand")}
                        >
                            <OndemandVideoIcon />
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
                                background: `linear-gradient(90deg, ${alpha(
                                    theme.palette.background.paper,
                                    0
                                )} 0%, ${alpha(theme.palette.background.paper, 0)} 90%, ${alpha(
                                    theme.palette.background.paper,
                                    1
                                )} 100%)`,
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
            </Box>
            {(appearanceOptions.showCourseMenu || appearanceOptions.showCourseNote) && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {appearanceOptions.showCourseMenu && <CourseCardMenu course={props.course} />}
                    {appearanceOptions.showCourseNote && note && (
                        <Tooltip
                            title={
                                <Typography variant="body1" sx={{ whiteSpace: "break-spaces" }}>
                                    {note}
                                </Typography>
                            }
                        >
                            <IconButton size="small">
                                <NoteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            )}
        </Paper>
    );
});
