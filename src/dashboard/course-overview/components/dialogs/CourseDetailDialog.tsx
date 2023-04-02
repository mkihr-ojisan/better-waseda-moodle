import { Course } from "@/common/course/course";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";
import ReplayIcon from "@mui/icons-material/Replay";
import { useCourseOverviewContext } from "../CourseOverview";
import { unique } from "@/common/util/array";
import { TimetableSettingsDialog } from "./TimetableSettingsDialog";
import { getURLFromKey } from "@/common/api/waseda/syllabus";
import { getCourseColor } from "@/common/course/course-color";
import { DateTimeFormat } from "@/common/util/intl";

export type CourseDetailDialogProps = {
    open: boolean;
    onClose: () => void;
    course: Course;
};

export const CourseDetailDialog: FC<CourseDetailDialogProps> = (props) => {
    return (
        <Dialog open={props.open} onClose={props.onClose} closeAfterTransition maxWidth="sm" fullWidth>
            {props.open && <CourseDetailDialogContent {...props} />}
        </Dialog>
    );
};

const dateFormat = new DateTimeFormat({ dateStyle: "long" });

const CourseDetailDialogContent: FC<CourseDetailDialogProps> = (props) => {
    const context = useCourseOverviewContext();

    const [courseNameOverrides, setCourseNameOverrides] = useConfig(ConfigKey.CourseNameOverrides);
    const courseName = courseNameOverrides[props.course.id] ?? props.course.name ?? "";

    const [syllabusKeys, setSyllabusKeys] = useConfig(ConfigKey.CourseSyllabusKeys);
    const syllabusUrl = useMemo(() => {
        const syllabusKey = syllabusKeys[props.course.id];
        return (syllabusKey && getURLFromKey(syllabusKey)) ?? "";
    }, [props.course.id, syllabusKeys]);

    const [deliveryMethod, setDeliveryMethod] = useConfig(ConfigKey.CourseDeliveryMethods);

    const classroom = useMemo(() => {
        const timetable = context.timetableData[props.course.id];
        if (timetable === undefined) return "";
        return unique(timetable.map((t) => t.classroom)).join(", ");
    }, [context.timetableData, props.course.id]);

    const [streamingURLs, setStreamingURLs] = useConfig(ConfigKey.CourseStreamingURLs);

    const [colors, setColors] = useConfig(ConfigKey.CourseColor);

    const handleChangeCourseName = useCallback(
        (value: string) => {
            if (value === props.course.name) {
                const newCourseNameOverrides = { ...courseNameOverrides };
                delete newCourseNameOverrides[props.course.id];
                setCourseNameOverrides(newCourseNameOverrides);
            } else {
                setCourseNameOverrides({
                    ...courseNameOverrides,
                    [props.course.id]: value,
                });
            }
        },
        [courseNameOverrides, props.course.id, props.course.name, setCourseNameOverrides]
    );

    const handleChangeSyllabusUrl = useCallback(
        (value: string) => {
            if (value === "") {
                const newSyllabusKeys = { ...syllabusKeys };
                delete newSyllabusKeys[props.course.id];
                setSyllabusKeys(newSyllabusKeys);
            } else {
                const url = new URL(value);
                const params = new URLSearchParams(url.search);
                const pKey = params.get("pKey");
                setSyllabusKeys({
                    ...syllabusKeys,
                    [props.course.id]: pKey,
                });
            }
        },
        [props.course.id, setSyllabusKeys, syllabusKeys]
    );

    const validateSyllabusUrl = useCallback((value: string) => {
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
    }, []);

    const handleChangeDeliveryMethod = useCallback(
        (event: SelectChangeEvent<"face_to_face" | "realtime_streaming" | "on_demand" | "none">) => {
            if (event.target.value === "none") {
                const newDeliveryMethod = { ...deliveryMethod };
                delete newDeliveryMethod[props.course.id];
                setDeliveryMethod(newDeliveryMethod);
            } else {
                setDeliveryMethod({
                    ...deliveryMethod,
                    [props.course.id]: event.target.value,
                });
            }
        },
        [deliveryMethod, props.course.id, setDeliveryMethod]
    );

    const handleChangeStreamingURL = useCallback(
        (value: string) => {
            if (value === "") {
                const newStreamingURLs = { ...streamingURLs };
                delete newStreamingURLs[props.course.id];
                setStreamingURLs(newStreamingURLs);
            } else {
                setStreamingURLs({
                    ...streamingURLs,
                    [props.course.id]: value,
                });
            }
        },
        [props.course.id, setStreamingURLs, streamingURLs]
    );

    const handleChangeColor = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newColor = event.target.value;
            if (newColor === "") {
                const newColors = { ...colors };
                delete newColors[props.course.id];
                setColors(newColors);
            } else {
                setColors({
                    ...colors,
                    [props.course.id]: newColor,
                });
            }
        },
        [colors, props.course.id, setColors]
    );

    const handleResetColor = useCallback(async () => {
        const newColors = { ...colors };
        newColors[props.course.id] = await getCourseColor(props.course);
        setColors(newColors);
    }, [colors, props.course, setColors]);

    const [timetableSettingsDialogOpen, setTimetableSettingsDialogOpen] = useState(false);
    const handleOpenTimetableSettingsDialog = useCallback(() => {
        setTimetableSettingsDialogOpen(true);
    }, []);
    const handleCloseTimetableSettingsDialog = useCallback(() => {
        setTimetableSettingsDialogOpen(false);
    }, []);

    const [notes, setNotes] = useConfig(ConfigKey.CourseNotes);
    const handleChangeNotes = useCallback(
        (value: string) => {
            if (value === "") {
                const newNotes = { ...notes };
                delete newNotes[props.course.id];
                setNotes(newNotes);
            } else {
                setNotes({
                    ...notes,
                    [props.course.id]: value,
                });
            }
        },
        [notes, props.course.id, setNotes]
    );

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2, paddingRight: "48px" }}>
                {browser.i18n.getMessage("course_detail_dialog_title", courseName)}
                <IconButton aria-label="close" onClick={props.onClose} sx={{ position: "absolute", right: 8, top: 12 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Table sx={{ tableLayout: "fixed" }}>
                    <TableBody>
                        <TableRow>
                            <TableCell variant="head" width="100">
                                {browser.i18n.getMessage("course_detail_dialog_course_name")}
                            </TableCell>
                            <TableCell>
                                <EditableField
                                    value={courseName}
                                    onChange={handleChangeCourseName}
                                    defaultValue={props.course.name}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                {browser.i18n.getMessage("course_detail_dialog_syllabus")}
                            </TableCell>
                            <TableCell>
                                <EditableField
                                    value={syllabusUrl}
                                    onChange={handleChangeSyllabusUrl}
                                    validate={validateSyllabusUrl}
                                >
                                    {syllabusUrl ? (
                                        <a href={syllabusUrl} target="_blank" rel="noreferrer">
                                            {syllabusUrl}
                                        </a>
                                    ) : (
                                        browser.i18n.getMessage("course_detail_dialog_unspecified")
                                    )}
                                </EditableField>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                {browser.i18n.getMessage("course_detail_dialog_delivery_method")}
                            </TableCell>
                            <TableCell>
                                <Select
                                    variant="standard"
                                    value={deliveryMethod[props.course.id] || "none"}
                                    onChange={handleChangeDeliveryMethod}
                                    sx={{ minWidth: "200px" }}
                                >
                                    <MenuItem value="none">
                                        {browser.i18n.getMessage("course_delivery_method_none")}
                                    </MenuItem>
                                    <MenuItem value="face_to_face">
                                        {browser.i18n.getMessage("course_delivery_method_face_to_face")}
                                    </MenuItem>
                                    <MenuItem value="realtime_streaming">
                                        {browser.i18n.getMessage("course_delivery_method_realtime_streaming")}
                                    </MenuItem>
                                    <MenuItem value="on_demand">
                                        {browser.i18n.getMessage("course_delivery_method_on_demand")}
                                    </MenuItem>
                                </Select>
                            </TableCell>
                        </TableRow>
                        {deliveryMethod[props.course.id] === "face_to_face" ? (
                            <TableRow>
                                <TableCell variant="head">
                                    {browser.i18n.getMessage("course_detail_dialog_classroom")}
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 34px",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {classroom || browser.i18n.getMessage("course_detail_dialog_unspecified")}
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <IconButton
                                                onClick={handleOpenTimetableSettingsDialog}
                                                size="small"
                                                title={browser.i18n.getMessage("course_detail_dialog_edit")}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : deliveryMethod[props.course.id] === "realtime_streaming" ? (
                            <TableRow>
                                <TableCell variant="head">
                                    {browser.i18n.getMessage("course_detail_dialog_streaming_url")}
                                </TableCell>
                                <TableCell>
                                    <EditableField
                                        value={streamingURLs[props.course.id] ?? ""}
                                        onChange={handleChangeStreamingURL}
                                    >
                                        <a href={streamingURLs[props.course.id]} target="_blank" rel="noreferrer">
                                            {streamingURLs[props.course.id] ||
                                                browser.i18n.getMessage("course_detail_dialog_unspecified")}
                                        </a>
                                    </EditableField>
                                </TableCell>
                            </TableRow>
                        ) : null}
                        <TableRow>
                            <TableCell variant="head">
                                {browser.i18n.getMessage("course_detail_dialog_color")}
                            </TableCell>
                            <TableCell>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 34px",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            type="color"
                                            value={colors[props.course.id]}
                                            onChange={handleChangeColor}
                                            sx={{ input: { width: 50, padding: 0, cursor: "pointer" } }}
                                        />
                                        <Box component="span" mx={1}>
                                            {colors[props.course.id]}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <IconButton
                                            onClick={handleResetColor}
                                            size="small"
                                            title={browser.i18n.getMessage("course_detail_dialog_set_default")}
                                        >
                                            <ReplayIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">{browser.i18n.getMessage("course_detail_dialog_note")}</TableCell>
                            <TableCell>
                                <EditableMultilineField
                                    value={notes[props.course.id] ?? ""}
                                    onChange={handleChangeNotes}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">{browser.i18n.getMessage("course_detail_dialog_date")}</TableCell>
                            <TableCell>
                                {props.course.date &&
                                    dateFormat.formatRange(props.course.date?.start, props.course.date?.end)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                {browser.i18n.getMessage("course_detail_dialog_image")}
                            </TableCell>
                            <TableCell>
                                {props.course.courseImageUrl && (
                                    <Box
                                        component="img"
                                        src={props.course.courseImageUrl}
                                        alt={props.course.name}
                                        sx={{ maxHeight: "8em" }}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">
                                {browser.i18n.getMessage("course_detail_dialog_hidden")}
                            </TableCell>
                            <TableCell>
                                {props.course.hidden
                                    ? browser.i18n.getMessage("course_detail_dialog_hidden_true")
                                    : browser.i18n.getMessage("course_detail_dialog_hidden_false")}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">{browser.i18n.getMessage("course_detail_dialog_id")}</TableCell>
                            <TableCell>
                                {props.course.id}, {props.course.wasedaId}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>

            <TimetableSettingsDialog
                course={props.course}
                open={timetableSettingsDialogOpen}
                onClose={handleCloseTimetableSettingsDialog}
            />
        </>
    );
};

type EditableFieldProps = {
    value: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    validate?: (value: string) => boolean;
    children?: ReactNode;
};

const EditableField: FC<EditableFieldProps> = (props) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(props.value);

    const handleEdit = useCallback(() => {
        setEditing(true);
    }, []);

    const handleCancel = useCallback(() => {
        setEditing(false);
        setValue(props.value);
    }, [props.value]);

    const handleSave = useCallback(() => {
        setEditing(false);
        props.onChange(value);
    }, [props, value]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    const handleReset = useCallback(() => {
        setValue(props.defaultValue ?? "");
    }, [props.defaultValue]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter") {
                handleSave();
            } else if (event.key === "Escape") {
                handleCancel();
                event.stopPropagation();
            }
        },
        [handleCancel, handleSave]
    );

    const isValid = useMemo(() => !props.validate || props.validate(value), [props, value]);

    return (
        <>
            {editing ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: props.defaultValue ? "1fr 34px 34px 34px" : "1fr 34px 34px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            value={value}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            autoFocus
                            onKeyDown={handleKeyDown}
                            error={!isValid}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            onClick={handleSave}
                            size="small"
                            disabled={!isValid}
                            title={browser.i18n.getMessage("course_detail_dialog_save")}
                        >
                            <CheckIcon />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{ display: "flex", alignItems: "center" }}
                        title={browser.i18n.getMessage("course_detail_dialog_cancel")}
                    >
                        <IconButton onClick={handleCancel} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {props.defaultValue && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton
                                onClick={handleReset}
                                size="small"
                                title={browser.i18n.getMessage("course_detail_dialog_set_default")}
                            >
                                <ReplayIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 34px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {props.children ?? <Typography>{props.value}</Typography>}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            onClick={handleEdit}
                            size="small"
                            title={browser.i18n.getMessage("course_detail_dialog_edit")}
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </>
    );
};

type EditableMultilineFieldProps = {
    value: string;
    onChange: (value: string) => void;
    children?: ReactNode;
};

const EditableMultilineField: FC<EditableMultilineFieldProps> = (props) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(props.value);

    const handleEdit = useCallback(() => {
        setEditing(true);
    }, []);

    const handleCancel = useCallback(() => {
        setEditing(false);
        setValue(props.value);
    }, [props.value]);

    const handleSave = useCallback(() => {
        setEditing(false);
        props.onChange(value);
    }, [props, value]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    }, []);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter" && event.ctrlKey) {
                handleSave();
            } else if (event.key === "Escape") {
                handleCancel();
                event.stopPropagation();
            }
        },
        [handleCancel, handleSave]
    );

    return (
        <>
            {editing ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 34px 34px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            value={value}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            autoFocus
                            multiline
                            onKeyDown={handleKeyDown}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            onClick={handleSave}
                            size="small"
                            title={browser.i18n.getMessage("course_detail_dialog_save")}
                        >
                            <CheckIcon />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{ display: "flex", alignItems: "center" }}
                        title={browser.i18n.getMessage("course_detail_dialog_cancel")}
                    >
                        <IconButton onClick={handleCancel} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 34px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {props.children ?? <Typography sx={{ whiteSpace: "break-spaces" }}>{props.value}</Typography>}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            onClick={handleEdit}
                            size="small"
                            title={browser.i18n.getMessage("course_detail_dialog_edit")}
                        >
                            <EditIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </>
    );
};
