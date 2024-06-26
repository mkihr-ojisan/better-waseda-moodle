import { DayOfWeek, DayString, Term, TermString, TimetableData, useTimetableData } from "@/common/course/timetable";
import { getSchoolYear } from "@/common/util/school-year";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import React, { ChangeEvent, FC, useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";

export type TabTimetableProps = {
    timetableData: TimetableData;
    setTimetableData: (timetableData: TimetableData | ((old: TimetableData) => TimetableData)) => void;
    courseId: string;
};

export const TabTimetable: FC<TabTimetableProps> = ({ timetableData, setTimetableData, courseId }) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    const [currentTimetable] = useTimetableData();

    const conflicts = useMemo(
        () => checkConflict(currentTimetable, courseId, timetableData),
        [courseId, currentTimetable, timetableData]
    );

    const handleChangeYear = (i: number) => (event: ChangeEvent<HTMLInputElement>) => {
        setTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].year = parseInt(event.target.value);
            return newTimetableData;
        });
    };

    const handleChangeTerm = (i: number) => (event: SelectChangeEvent<TermString>) => {
        setTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].term = Term.fromString(event.target.value as TermString);
            return newTimetableData;
        });
    };

    const handleChangeDay = (i: number) => (event: SelectChangeEvent<DayString>) => {
        setTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].day = DayOfWeek.fromString(event.target.value as DayString);
            return newTimetableData;
        });
    };

    const handleChangePeriodStart = (i: number) => (event: SelectChangeEvent<number>) => {
        setTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].period.from = newTimetableData[i].period.toInclusive = event.target.value as number;
            return newTimetableData;
        });
    };

    const handleChangePeriodEnd = (i: number) => (event: SelectChangeEvent<number>) => {
        setTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].period.toInclusive = event.target.value as number;
            return newTimetableData;
        });
    };

    const handleChangeClassroom = (i: number) => (event: ChangeEvent<HTMLInputElement>) => {
        setTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData[i].classroom = event.target.value;
            return newTimetableData;
        });
    };

    const handleDeleteEntry = (i: number) => () => {
        setTimetableData((old) => {
            const newTimetableData = [...old];
            newTimetableData.splice(i, 1);
            return newTimetableData;
        });
    };

    const handleAddEntry = () => {
        setTimetableData((old) => {
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

    const props = {
        timetableData,
        courseId,
        conflicts,
        handleChangeYear,
        handleChangeTerm,
        handleChangeDay,
        handleChangePeriodStart,
        handleChangePeriodEnd,
        handleChangeClassroom,
        handleDeleteEntry,
        handleAddEntry,
    };

    return isMobile ? <TabTimetableContentMobile {...props} /> : <TabTimetableContentDesktop {...props} />;
};

type TabTimetableContentProps = {
    timetableData: TimetableData;
    courseId: string;
    conflicts: { index: number; conflictWith: { courseId: string; index: number } }[];
    handleChangeYear: (i: number) => (event: ChangeEvent<HTMLInputElement>) => void;
    handleChangeTerm: (i: number) => (event: SelectChangeEvent<TermString>) => void;
    handleChangeDay: (i: number) => (event: SelectChangeEvent<DayString>) => void;
    handleChangePeriodStart: (i: number) => (event: SelectChangeEvent<number>) => void;
    handleChangePeriodEnd: (i: number) => (event: SelectChangeEvent<number>) => void;
    handleChangeClassroom: (i: number) => (event: ChangeEvent<HTMLInputElement>) => void;
    handleDeleteEntry: (i: number) => () => void;
    handleAddEntry: () => void;
};

const TabTimetableContentDesktop: FC<TabTimetableContentProps> = ({
    timetableData,
    courseId,
    conflicts,
    handleChangeYear,
    handleChangeTerm,
    handleChangeDay,
    handleChangePeriodStart,
    handleChangePeriodEnd,
    handleChangeClassroom,
    handleDeleteEntry,
    handleAddEntry,
}) => {
    return (
        <>
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
                            {browser.i18n.getMessage("course_settings_dialog_timetable_header_year")}
                        </TableCell>
                        <TableCell align="center">
                            {browser.i18n.getMessage("course_settings_dialog_timetable_header_term")}
                        </TableCell>
                        <TableCell align="center">
                            {browser.i18n.getMessage("course_settings_dialog_timetable_header_day")}
                        </TableCell>
                        <TableCell align="center">
                            {browser.i18n.getMessage("course_settings_dialog_timetable_header_period_start")}
                        </TableCell>
                        <TableCell align="center">
                            {browser.i18n.getMessage("course_settings_dialog_timetable_header_period_end")}
                        </TableCell>
                        <TableCell align="center">
                            {browser.i18n.getMessage("course_settings_dialog_timetable_header_classroom")}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {timetableData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} align="center" width={1000}>
                                {browser.i18n.getMessage("course_settings_dialog_timetable_no_entries")}
                            </TableCell>
                        </TableRow>
                    )}
                    {timetableData.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {(() => {
                                    const conflictWith = conflicts.find(
                                        (conflict) => conflict.index === index
                                    )?.conflictWith;
                                    if (!conflictWith) return undefined;

                                    let title;
                                    if (conflictWith.courseId === courseId) {
                                        title = browser.i18n.getMessage(
                                            "course_settings_dialog_timetable_conflict_with_nth_entry",
                                            conflictWith.index + 1
                                        );
                                    } else {
                                        title = browser.i18n.getMessage(
                                            "course_settings_dialog_timetable_conflict_with_other_course"
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
                                        "course_settings_dialog_timetable_header_delete_entry"
                                    )}
                                    onClick={handleDeleteEntry(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
                <Button variant="outlined" onClick={handleAddEntry} startIcon={<AddIcon />} sx={{ marginRight: 1 }}>
                    {browser.i18n.getMessage("course_settings_dialog_timetable_add_entry")}
                </Button>
            </Box>
        </>
    );
};

const TabTimetableContentMobile: FC<TabTimetableContentProps> = ({
    timetableData,
    courseId,
    conflicts,
    handleChangeYear,
    handleChangeTerm,
    handleChangeDay,
    handleChangePeriodStart,
    handleChangePeriodEnd,
    handleChangeClassroom,
    handleDeleteEntry,
    handleAddEntry,
}) => {
    return (
        <Stack spacing={1} p={0}>
            {timetableData.length === 0 && (
                <Typography align="center">
                    {browser.i18n.getMessage("course_settings_dialog_timetable_no_entries")}
                </Typography>
            )}
            {timetableData.map((entry, index) => (
                <Paper key={index} sx={{ padding: 2, borderColor: "text.primary" }} variant="outlined">
                    <Stack spacing={1}>
                        <TextField
                            label={browser.i18n.getMessage("course_settings_dialog_timetable_header_year")}
                            type="number"
                            variant="outlined"
                            value={entry.year}
                            onChange={handleChangeYear(index)}
                        />
                        <FormControl>
                            <InputLabel id={`term-${index}-label`}>
                                {browser.i18n.getMessage("course_settings_dialog_timetable_header_term")}
                            </InputLabel>
                            <Select
                                labelId={`term-${index}-label`}
                                value={entry.term.toString()}
                                onChange={handleChangeTerm(index)}
                                label={browser.i18n.getMessage("course_settings_dialog_timetable_header_term")}
                            >
                                <MenuItem value={Term.FULL_YEAR.toString()}>{Term.FULL_YEAR.toLocaleString()}</MenuItem>
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
                        </FormControl>
                        <FormControl>
                            <InputLabel id={`day-${index}-label`}>
                                {browser.i18n.getMessage("course_settings_dialog_timetable_header_day")}
                            </InputLabel>
                            <Select
                                labelId={`day-${index}-label`}
                                value={entry.day.toString()}
                                onChange={handleChangeDay(index)}
                                label={browser.i18n.getMessage("course_settings_dialog_timetable_header_day")}
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
                        </FormControl>
                        <FormControl>
                            <InputLabel id={`period-start-${index}-label`}>
                                {browser.i18n.getMessage("course_settings_dialog_timetable_header_period_start")}
                            </InputLabel>
                            <Select
                                labelId={`period-start-${index}-label`}
                                value={entry.period.from}
                                onChange={handleChangePeriodStart(index)}
                                label={browser.i18n.getMessage("course_settings_dialog_timetable_header_period_start")}
                            >
                                {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                                    <MenuItem key={period} value={period}>
                                        {browser.i18n.getMessage(`period_${period}`)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id={`period-end-${index}-label`}>
                                {browser.i18n.getMessage("course_settings_dialog_timetable_header_period_end")}
                            </InputLabel>
                            <Select
                                labelId={`period-end-${index}-label`}
                                value={entry.period.toInclusive}
                                onChange={handleChangePeriodEnd(index)}
                                label={browser.i18n.getMessage("course_settings_dialog_timetable_header_period_end")}
                            >
                                {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                                    <MenuItem key={period} value={period}>
                                        {browser.i18n.getMessage(`period_${period}`)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label={browser.i18n.getMessage("course_settings_dialog_timetable_header_classroom")}
                            variant="outlined"
                            value={entry.classroom}
                            onChange={handleChangeClassroom(index)}
                        />

                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            {(() => {
                                const conflictWith = conflicts.find(
                                    (conflict) => conflict.index === index
                                )?.conflictWith;
                                if (!conflictWith) return undefined;

                                let title;
                                if (conflictWith.courseId === courseId) {
                                    title = browser.i18n.getMessage(
                                        "course_settings_dialog_timetable_conflict_with_nth_entry",
                                        conflictWith.index + 1
                                    );
                                } else {
                                    title = browser.i18n.getMessage(
                                        "course_settings_dialog_timetable_conflict_with_other_course"
                                    );
                                }
                                return (
                                    <>
                                        <Typography color="error">
                                            <ErrorIcon />
                                            {title}
                                        </Typography>
                                    </>
                                );
                            })()}
                            <div style={{ flexGrow: 1 }} />
                            <Button onClick={handleDeleteEntry(index)} startIcon={<DeleteIcon />} variant="outlined">
                                {browser.i18n.getMessage("course_settings_dialog_timetable_header_delete_entry")}
                            </Button>
                        </div>
                    </Stack>
                </Paper>
            ))}

            <Button variant="outlined" onClick={handleAddEntry} startIcon={<AddIcon />}>
                {browser.i18n.getMessage("course_settings_dialog_timetable_add_entry")}
            </Button>
        </Stack>
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
