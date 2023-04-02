import { CollectSyllabusInformationResult } from "@/common/course/collect-syllabus-information";
import { call } from "@/common/util/messenger/client";
import { getSchoolYear } from "@/common/util/school-year";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    LinearProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { FC, useCallback, useState } from "react";

export type CollectCourseInformationDialogProps = {
    open: boolean;
    onClose: () => void;
};

export const CollectCourseInformationDialog: FC<CollectCourseInformationDialogProps> = (props) => {
    const handleClose = useCallback(
        (_event: any, reason?: "backdropClick" | "escapeKeyDown") => {
            if (reason !== "backdropClick") {
                props.onClose();
            }
        },
        [props]
    );

    return (
        <Dialog open={props.open} onClose={handleClose} closeAfterTransition maxWidth="sm" fullWidth>
            {props.open && <CollectCourseInformationDialogContent {...props} />}
        </Dialog>
    );
};

const CollectCourseInformationDialogContent: FC<CollectCourseInformationDialogProps> = (props) => {
    const [state, setState] = useState<"options" | "progress" | "result">("options");

    const [onlySpecifiedYear, setOnlySpecifiedYear] = useState(true);
    const [specifiedYear, setSpecifiedYear] = useState(() => getSchoolYear(new Date()));
    const [onlyCoursesWithoutTimetableInfo, setOnlyCoursesWithoutTimetableInfo] = useState(true);

    const handleChangeOnlySpecifiedYear = useCallback(
        (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            setOnlySpecifiedYear(checked);
        },
        []
    );
    const handleChangeSpecifiedYear = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSpecifiedYear(Number(event.target.value));
    }, []);

    const handleChangeOnlyCoursesWithoutTimetableData = useCallback(
        (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            setOnlyCoursesWithoutTimetableInfo(checked);
        },
        []
    );

    const [progress, setProgress] = useState<number | undefined>(undefined);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState<CollectSyllabusInformationResult>();
    const handleStart = useCallback(async () => {
        setState("progress");

        const generator = await call("collectSyllabusInformation", {
            onlyCoursesWithoutTimetableInfo,
            year: onlySpecifiedYear ? specifiedYear : undefined,
        });

        for (;;) {
            const { done, value } = await generator.next();
            if (done) {
                setResult(value);
                break;
            } else {
                setProgress(value.progress);
                setMessage(value.message);
            }
        }

        setState("result");
    }, [onlyCoursesWithoutTimetableInfo, onlySpecifiedYear, specifiedYear]);

    return state === "options" ? (
        <>
            <DialogTitle>{browser.i18n.getMessage("collect_syllabus_information_dialog_title")}</DialogTitle>
            <DialogContent>
                <Box my={1}>
                    <Typography variant="body1">
                        {browser.i18n.getMessage("collect_syllabus_information_dialog_description")}
                    </Typography>
                </Box>

                <Stack direction="row" alignItems="center">
                    <FormControlLabel
                        control={<Checkbox checked={onlySpecifiedYear} onChange={handleChangeOnlySpecifiedYear} />}
                        label={browser.i18n.getMessage("collect_syllabus_information_dialog_only_specified_year")}
                    />
                    <TextField
                        variant="standard"
                        type="number"
                        value={specifiedYear}
                        disabled={!onlySpecifiedYear}
                        sx={{ width: 100 }}
                        onChange={handleChangeSpecifiedYear}
                    />
                </Stack>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={onlyCoursesWithoutTimetableInfo}
                            onChange={handleChangeOnlyCoursesWithoutTimetableData}
                        />
                    }
                    label={browser.i18n.getMessage(
                        "collect_syllabus_information_dialog_only_courses_without_timetable_data"
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    {browser.i18n.getMessage("collect_syllabus_information_dialog_cancel")}
                </Button>
                <Button onClick={handleStart}>
                    {browser.i18n.getMessage("collect_syllabus_information_dialog_start")}
                </Button>
            </DialogActions>
        </>
    ) : state === "progress" ? (
        <>
            <DialogTitle>{browser.i18n.getMessage("collect_syllabus_information_progress_title")}</DialogTitle>
            <DialogContent>
                <Box my={1} sx={{ minHeight: "3em" }}>
                    {message}
                </Box>
                <LinearProgress
                    variant={progress === undefined ? "indeterminate" : "determinate"}
                    value={progress && progress * 100}
                />
            </DialogContent>
        </>
    ) : state === "result" ? (
        <>
            <DialogTitle>{browser.i18n.getMessage("collect_syllabus_information_result_title")}</DialogTitle>
            <DialogContent>
                <Box mb={1}>
                    <Typography variant="body1">
                        {browser.i18n.getMessage("collect_syllabus_information_result_description")}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1">
                        {browser.i18n.getMessage("collect_syllabus_information_result_failed_courses")}
                    </Typography>
                    {result?.failedCourses.map((course) => (
                        <Typography variant="body2" color="text.secondary" key={course.id}>
                            {course.name}
                        </Typography>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    {browser.i18n.getMessage("collect_syllabus_information_result_close")}
                </Button>
            </DialogActions>
        </>
    ) : null;
};
