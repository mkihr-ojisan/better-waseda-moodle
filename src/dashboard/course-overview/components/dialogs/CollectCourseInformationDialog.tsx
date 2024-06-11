import { CollectSyllabusInformationResult } from "@/common/course/collect-syllabus-information";
import { call, cancelGenerator } from "@/common/util/messenger/client";
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
import React, { FC, useCallback, useRef, useState } from "react";

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
    const [setEnglishName, setSetEnglishName] = useState(false);

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

    const handleChangeSetEnglishName = useCallback((_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setSetEnglishName(checked);
    }, []);

    const [progress, setProgress] = useState<number | undefined>(undefined);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState<CollectSyllabusInformationResult>();
    const isCanceled = useRef(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const handleStart = useCallback(async () => {
        setState("progress");

        const generator = await call("collectSyllabusInformation", {
            onlyCoursesWithoutTimetableInfo,
            year: onlySpecifiedYear ? specifiedYear : undefined,
            setEnglishName,
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
            if (isCanceled.current) {
                cancelGenerator(generator);
                props.onClose();
                break;
            }
        }

        setState("result");
    }, [onlyCoursesWithoutTimetableInfo, onlySpecifiedYear, props, setEnglishName, specifiedYear]);

    return state === "options" ? (
        <>
            <DialogTitle>{browser.i18n.getMessage("collect_syllabus_information_dialog_title")}</DialogTitle>
            <DialogContent>
                <Box my={1}>
                    <Typography variant="body1">
                        {browser.i18n.getMessage("collect_syllabus_information_dialog_description")}
                    </Typography>
                </Box>

                <Stack>
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
                    <FormControlLabel
                        control={<Checkbox checked={setEnglishName} onChange={handleChangeSetEnglishName} />}
                        label={browser.i18n.getMessage("collect_syllabus_information_dialog_set_english_name")}
                    />
                </Stack>
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
                    {isCanceling ? browser.i18n.getMessage("collect_syllabus_information_progress_canceling") : message}
                </Box>
                <LinearProgress
                    variant={progress === undefined || isCanceling ? "indeterminate" : "determinate"}
                    value={progress && progress * 100}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        isCanceled.current = true;
                        setIsCanceling(true);
                    }}
                >
                    {browser.i18n.getMessage("cancel")}
                </Button>
            </DialogActions>
        </>
    ) : state === "result" ? (
        <>
            <DialogTitle>{browser.i18n.getMessage("collect_syllabus_information_result_title")}</DialogTitle>
            <DialogContent>
                {result && result.failedCourses.length > 0 && (
                    <details>
                        <summary>
                            <Typography variant="body1" component="span" color="text.secondary">
                                {browser.i18n.getMessage("collect_syllabus_information_result_failed_courses")}
                            </Typography>
                        </summary>
                        <ul>
                            {result?.failedCourses.map((course) => (
                                <Typography component="li" variant="body2" color="text.secondary" key={course.id}>
                                    {course.name}
                                </Typography>
                            ))}
                        </ul>
                    </details>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    {browser.i18n.getMessage("collect_syllabus_information_result_close")}
                </Button>
            </DialogActions>
        </>
    ) : null;
};
