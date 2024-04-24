import { Course } from "@/common/course/course";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tab,
    Theme,
    useMediaQuery,
} from "@mui/material";
import React, { FC, useState } from "react";
import { TabGeneral, TabGeneralValues } from "./TabGeneral";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey, getConfig } from "@/common/config/config";
import { getURLFromKey } from "@/common/api/waseda/syllabus";
import { isCustomCourse, isMoodleCourse } from "@/common/course/course-provider-type-guard";
import { usePromise } from "@/common/react/hooks/usePromise";
import { DEFAULT_COURSE_COLOR, getCourseColor } from "@/common/course/course-color";
import { TabTimetable } from "./TabTimetable";
import { checkTimetableConflict, getTimetableData, setTimetableData } from "@/common/course/timetable";
import { call } from "@/common/util/messenger/client";
import CloseIcon from "@mui/icons-material/Close";

export type CourseSettingsDialogProps = {
    open: boolean;
    onClose: () => void;
    course: Course;
};

export const CourseSettingsDialog: FC<CourseSettingsDialogProps> = (props) => {
    const handleClose = (_: unknown, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason === "backdropClick") return;
        props.onClose();
    };

    const fullScreen = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    return (
        <Dialog open={props.open} onClose={handleClose} maxWidth={false} fullScreen={fullScreen}>
            <CourseSettingsDialogContent {...props} fullscreen={fullScreen} />
        </Dialog>
    );
};

type CourseSettingsDialogContentProps = CourseSettingsDialogProps & {
    fullscreen: boolean;
};

const CourseSettingsDialogContent: FC<CourseSettingsDialogContentProps> = ({ course, onClose, ...props }) => {
    const [tab, setTab] = useState("general");

    const [syllabusKeys, setSyllabusKeys] = useConfig(ConfigKey.CourseSyllabusKeys);
    const [deliveryMethods, setDeliveryMethods] = useConfig(ConfigKey.CourseDeliveryMethods);
    const [streamingURLs, setStreamingURLs] = useConfig(ConfigKey.CourseStreamingURLs);
    const [colors, setColors] = useConfig(ConfigKey.CourseColor);
    const [notes, setNotes] = useConfig(ConfigKey.CourseNotes);
    const [nameOverrides, setNameOverrides] = useConfig(ConfigKey.CourseNameOverrides);
    const [assignmentFilenameTemplates, setAssignmentFilenameTemplates] = useConfig(
        ConfigKey.AssignmentFilenameTemplateCourse
    );
    const [generalValues, setGeneralValues] = useState<TabGeneralValues>(() => {
        const syllabusKey = syllabusKeys[course.id];
        return {
            name: nameOverrides[course.id] ?? course.name ?? "",
            syllabusURL: syllabusKey ? getURLFromKey(syllabusKey) : "",
            deliveryMethod: deliveryMethods[course.id] ?? ("none" as const),
            streamingURL: streamingURLs[course.id] ?? "",
            color: colors[course.id],
            note: notes[course.id] ?? "",
            assignmentFilenameTemplate:
                assignmentFilenameTemplates[course.id] ?? getConfig(ConfigKey.AssignmentFilenameTemplate),
            customCourseUrl: isCustomCourse(course) ? course.url ?? undefined : undefined,
        };
    });
    const [customCourses, setCustomCourses] = useConfig(ConfigKey.CustomCourses);

    const { value: defaultColor } = usePromise(async () => {
        if (isMoodleCourse(course)) {
            return await getCourseColor(course.extra);
        } else {
            return DEFAULT_COURSE_COLOR;
        }
    }, [course]);

    const [newTimetableData, setNewTimetableData] = useState(() => [...(getTimetableData()[course.id] ?? [])]);

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleOK = () => {
        const mergedTimetableData = { ...getTimetableData(), [course.id]: newTimetableData };
        if (checkTimetableConflict(mergedTimetableData)) {
            setErrorDialogOpen(true);
            setErrorMessage(browser.i18n.getMessage("course_settings_dialog_error_timetable_conflict"));
            return;
        }

        if (!validateSyllabusUrl(generalValues.syllabusURL)) {
            setErrorDialogOpen(true);
            setErrorMessage(browser.i18n.getMessage("course_settings_dialog_error_invalid_syllabus_url"));
            return;
        }

        setNameOverrides({
            ...nameOverrides,
            [course.id]: generalValues.name === course.name ? undefined : generalValues.name,
        });
        setSyllabusKeys({
            ...syllabusKeys,
            [course.id]: (() => {
                if (generalValues.syllabusURL === "") return undefined;
                const url = new URL(generalValues.syllabusURL);
                return url.searchParams.get("pKey") ?? undefined;
            })(),
        });
        setDeliveryMethods({
            ...deliveryMethods,
            [course.id]: generalValues.deliveryMethod === "none" ? undefined : generalValues.deliveryMethod,
        });
        setStreamingURLs({
            ...streamingURLs,
            [course.id]: generalValues.deliveryMethod === "realtime_streaming" ? generalValues.streamingURL : undefined,
        });
        setColors({ ...colors, [course.id]: generalValues.color || undefined });
        setNotes({ ...notes, [course.id]: generalValues.note || undefined });
        setAssignmentFilenameTemplates({
            ...assignmentFilenameTemplates,
            [course.id]:
                generalValues.assignmentFilenameTemplate === getConfig(ConfigKey.AssignmentFilenameTemplate)
                    ? undefined
                    : generalValues.assignmentFilenameTemplate,
        });
        setTimetableData(mergedTimetableData);

        if (isCustomCourse(course)) {
            setCustomCourses(
                customCourses.map((c) =>
                    c.id === course.id ? { ...c, url: generalValues.customCourseUrl || null } : c
                )
            );
        }

        onClose();
    };

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const handleConfirmDelete = async () => {
        await call("deleteCustomCourse", course.id);
        onClose();
    };

    return (
        <>
            <DialogTitle sx={{ paddingRight: "64px", maxWidth: "800px" }}>
                {browser.i18n.getMessage("course_settings_dialog_title", course.name)}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <TabContext value={tab}>
                <TabList onChange={(e, value) => setTab(value)} sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tab label={browser.i18n.getMessage("course_settings_dialog_general_tab")} value="general" />
                    <Tab label={browser.i18n.getMessage("course_settings_dialog_timetable_tab")} value="timetable" />
                </TabList>
                <div
                    style={{
                        maxWidth: 800,
                        height: props.fullscreen ? undefined : 450,
                        flexGrow: props.fullscreen ? 1 : 0,
                        overflow: "auto",
                    }}
                >
                    <TabPanel value="general">
                        <TabGeneral
                            defaultName={course.name}
                            value={generalValues}
                            setValue={setGeneralValues}
                            defaultColor={defaultColor}
                        />
                    </TabPanel>
                    <TabPanel value="timetable" sx={{ paddingX: 1 }}>
                        <TabTimetable
                            timetableData={newTimetableData}
                            setTimetableData={setNewTimetableData}
                            courseId={course.id}
                        />
                    </TabPanel>
                </div>
            </TabContext>
            <DialogActions>
                {isCustomCourse(course) && (
                    <Button onClick={() => setConfirmDeleteOpen(true)} color="primary">
                        {browser.i18n.getMessage("course_settings_dialog_delete")}
                    </Button>
                )}

                <Box flexGrow={1} />

                <Button onClick={onClose} color="primary">
                    {browser.i18n.getMessage("cancel")}
                </Button>
                <Button onClick={handleOK} color="primary">
                    {browser.i18n.getMessage("course_settings_dialog_set")}
                </Button>
            </DialogActions>

            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                <DialogContent>
                    <DialogContentText>{errorMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                        {browser.i18n.getMessage("close")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogContent>
                    <DialogContentText>
                        {browser.i18n.getMessage("course_settings_dialog_confirm_delete_message", course.name)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
                        {browser.i18n.getMessage("cancel")}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary">
                        {browser.i18n.getMessage("continue")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const validateSyllabusUrl = (value: string) => {
    if (value === "") {
        return true;
    }
    try {
        const url = new URL(value);
        const params = new URLSearchParams(url.search);
        const pKey = params.get("pKey");
        return !!pKey;
    } catch (e) {
        return false;
    }
};
