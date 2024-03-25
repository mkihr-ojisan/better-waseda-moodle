import { Course } from "@/common/course/course";
import {
    DayOfWeek,
    DayString,
    Term,
    TermString,
    TimetableData,
    setTimetableData,
    useTimetableData,
} from "@/common/course/timetable";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import { getSchoolYear } from "@/common/util/school-year";

export type TimetableSettingsDialogProps = {
    open: boolean;
    onClose: () => void;
    course: Course;
};

export const TimetableSettingsDialog: FC<TimetableSettingsDialogProps> = (props) => {
    const handleClose = useCallback(
        (_event: React.SyntheticEvent, reason?: string) => {
            if (reason !== "backdropClick") {
                props.onClose();
            }
        },
        [props]
    );

    return (
        <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md" closeAfterTransition>
            {props.open && <TimetableSettingsDialogContent {...props} />}
        </Dialog>
    );
};

const TimetableSettingsDialogContent: FC<TimetableSettingsDialogProps> = (props) => {
    const [timetableData] = useTimetableData();
    const [newTimetableData, setNewTimetableData] = useState(() => timetableData[props.course.id] ?? []);

    const conflicts = useMemo(
        () => checkConflict(timetableData, props.course.id, newTimetableData),
        [timetableData, props.course.id, newTimetableData]
    );

    const handleChangeYear = (i: number) => (event: ChangeEvent<HTMLInputElement>) => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].year = parseInt(event.target.value);
            return newTimetableData;
        });
    };

    const handleChangeTerm = (i: number) => (event: SelectChangeEvent<TermString>) => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].term = Term.fromString(event.target.value as TermString);
            return newTimetableData;
        });
    };

    const handleChangeDay = (i: number) => (event: SelectChangeEvent<DayString>) => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].day = DayOfWeek.fromString(event.target.value as DayString);
            return newTimetableData;
        });
    };

    const handleChangePeriodStart = (i: number) => (event: SelectChangeEvent<number>) => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].period.from = newTimetableData[i].period.toInclusive = event.target.value as number;
            return newTimetableData;
        });
    };

    const handleChangePeriodEnd = (i: number) => (event: SelectChangeEvent<number>) => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].period.toInclusive = event.target.value as number;
            return newTimetableData;
        });
    };

    const handleChangeClassroom = (i: number) => (event: ChangeEvent<HTMLInputElement>) => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].classroom = event.target.value;
            return newTimetableData;
        });
    };

    const handleDeleteEntry = (i: number) => () => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData.splice(i, 1);
            return newTimetableData;
        });
    };

    const handleAddEntry = () => {
        setNewTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData.push({
                year: getSchoolYear(new Date()),
                term: Term.FULL_YEAR,
                day: DayOfWeek.MONDAY,
                period: {
                    from: 1,
                    toInclusive: 1,
                },
                classroom: "",
            });
            return newTimetableData;
        });
    };

    const handleOK = () => {
        setTimetableData({
            ...timetableData,
            [props.course.id]: newTimetableData,
        });
        props.onClose();
    };

    return (
        <>
            <DialogTitle>
                {browser.i18n.getMessage("course_overview_timetable_settings_title", props.course.name)}
            </DialogTitle>
            <DialogContent>
                <DialogContentText></DialogContentText>
                <TableContainer sx={{ minHeight: 200, px: 8 }}>
                    <Table
                        size="small"
                        sx={{
                            whiteSpace: "nowrap",
                            "th, td:not(:last-child)": {
                                padding: 1,
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">
                                    {browser.i18n.getMessage("course_overview_timetable_settings_header_year")}
                                </TableCell>
                                <TableCell align="center">
                                    {browser.i18n.getMessage("course_overview_timetable_settings_header_term")}
                                </TableCell>
                                <TableCell align="center">
                                    {browser.i18n.getMessage("course_overview_timetable_settings_header_day")}
                                </TableCell>
                                <TableCell align="center">
                                    {browser.i18n.getMessage("course_overview_timetable_settings_header_period_start")}
                                </TableCell>
                                <TableCell align="center">
                                    {browser.i18n.getMessage("course_overview_timetable_settings_header_period_end")}
                                </TableCell>
                                <TableCell align="center">
                                    {browser.i18n.getMessage("course_overview_timetable_settings_header_classroom")}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newTimetableData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        {browser.i18n.getMessage("course_overview_timetable_settings_no_entries")}
                                    </TableCell>
                                </TableRow>
                            )}
                            {newTimetableData.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {(() => {
                                            const conflictWith = conflicts.find(
                                                (conflict) => conflict.index === index
                                            )?.conflictWith;
                                            if (!conflictWith) return undefined;

                                            let title;
                                            if (conflictWith.courseId === props.course.id) {
                                                title = browser.i18n.getMessage(
                                                    "course_overview_timetable_settings_conflict_with_nth_entry",
                                                    conflictWith.index + 1
                                                );
                                            } else {
                                                title = browser.i18n.getMessage(
                                                    "course_overview_timetable_settings_conflict_with_other_course"
                                                );
                                            }
                                            return (
                                                <Typography color="error" title={title}>
                                                    <ErrorIcon />
                                                </Typography>
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            variant="standard"
                                            value={entry.year}
                                            onChange={handleChangeYear(index)}
                                            sx={{ minWidth: "4em", textAlign: "right" }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Select
                                            variant="standard"
                                            value={entry.term.toString()}
                                            onChange={handleChangeTerm(index)}
                                        >
                                            <MenuItem value={Term.FULL_YEAR.toString()}>
                                                {Term.FULL_YEAR.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={Term.SPRING_SEMESTER.toString()}>
                                                {Term.SPRING_SEMESTER.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={Term.FALL_SEMESTER.toString()}>
                                                {Term.FALL_SEMESTER.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={Term.SPRING_QUARTER.toString()}>
                                                {Term.SPRING_QUARTER.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={Term.SUMMER_QUARTER.toString()}>
                                                {Term.SUMMER_QUARTER.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={Term.FALL_QUARTER.toString()}>
                                                {Term.FALL_QUARTER.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={Term.WINTER_QUARTER.toString()}>
                                                {Term.WINTER_QUARTER.toLocaleString()}
                                            </MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Select
                                            variant="standard"
                                            value={entry.day.toString()}
                                            onChange={handleChangeDay(index)}
                                        >
                                            <MenuItem value={DayOfWeek.MONDAY.toString()}>
                                                {DayOfWeek.MONDAY.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={DayOfWeek.TUESDAY.toString()}>
                                                {DayOfWeek.TUESDAY.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={DayOfWeek.WEDNESDAY.toString()}>
                                                {DayOfWeek.WEDNESDAY.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={DayOfWeek.THURSDAY.toString()}>
                                                {DayOfWeek.THURSDAY.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={DayOfWeek.FRIDAY.toString()}>
                                                {DayOfWeek.FRIDAY.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={DayOfWeek.SATURDAY.toString()}>
                                                {DayOfWeek.SATURDAY.toLocaleString()}
                                            </MenuItem>
                                            <MenuItem value={DayOfWeek.SUNDAY.toString()}>
                                                {DayOfWeek.SUNDAY.toLocaleString()}
                                            </MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Select
                                            variant="standard"
                                            value={entry.period.from}
                                            onChange={handleChangePeriodStart(index)}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                                                <MenuItem key={period} value={period}>
                                                    {browser.i18n.getMessage(`period_${period}`)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Select
                                            variant="standard"
                                            value={entry.period.toInclusive}
                                            onChange={handleChangePeriodEnd(index)}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                                                <MenuItem key={period} value={period}>
                                                    {browser.i18n.getMessage(`period_${period}`)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            variant="standard"
                                            value={entry.classroom}
                                            onChange={handleChangeClassroom(index)}
                                            sx={{ minWidth: "4em" }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            title={browser.i18n.getMessage(
                                                "course_overview_timetable_settings_header_delete_entry"
                                            )}
                                            onClick={handleDeleteEntry(index)}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
                    <Button variant="outlined" onClick={handleAddEntry} startIcon={<AddIcon />} sx={{ marginRight: 1 }}>
                        {browser.i18n.getMessage("course_overview_timetable_settings_add_entry")}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    {browser.i18n.getMessage("course_overview_timetable_settings_cancel_button")}
                </Button>
                <Button onClick={handleOK}>
                    {browser.i18n.getMessage("course_overview_timetable_settings_save_button")}
                </Button>
            </DialogActions>
        </>
    );
};

/**
 * 時間割データに重複がないかチェックする
 *
 * @param timetableData - 現在の時間割データ
 * @param courseId - 変更する時間割の科目ID
 * @param newTimetableData - 変更後の時間割データ
 * @returns 重複のリスト
 */
function checkConflict(
    timetableData: Partial<Record<string, TimetableData>>,
    courseId: string,
    newTimetableData: TimetableData
): { index: number; conflictWith: { courseId: string; index: number } }[] {
    const conflicts: { index: number; conflictWith: { courseId: string; index: number } }[] = [];

    // 他の科目との重複をチェック
    for (const [index, entry] of newTimetableData.entries()) {
        for (const [otherCourseId, otherTimetableData] of Object.entries(timetableData)) {
            if (otherCourseId === courseId) {
                continue;
            }
            for (const [otherIndex, otherEntry] of otherTimetableData?.entries() ?? []) {
                if (
                    entry.year === otherEntry.year &&
                    (entry.term.contains(otherEntry.term) || otherEntry.term.contains(entry.term)) &&
                    entry.day === otherEntry.day &&
                    entry.period.from <= otherEntry.period.toInclusive &&
                    otherEntry.period.from <= entry.period.toInclusive
                ) {
                    conflicts.push({
                        index,
                        conflictWith: {
                            courseId: otherCourseId,
                            index: otherIndex,
                        },
                    });
                }
            }
        }
    }

    // 同じ科目内での重複をチェック
    for (let index = 0; index < newTimetableData.length; index++) {
        const entry = newTimetableData[index];
        for (let otherIndex = index + 1; otherIndex < newTimetableData.length; otherIndex++) {
            const otherEntry = newTimetableData[otherIndex];
            if (
                entry.year === otherEntry.year &&
                (entry.term.contains(otherEntry.term) || otherEntry.term.contains(entry.term)) &&
                entry.day === otherEntry.day &&
                entry.period.from <= otherEntry.period.toInclusive &&
                otherEntry.period.from <= entry.period.toInclusive
            ) {
                conflicts.push({
                    index,
                    conflictWith: {
                        courseId,
                        index: otherIndex,
                    },
                });
            }
        }
    }

    return conflicts;
}
