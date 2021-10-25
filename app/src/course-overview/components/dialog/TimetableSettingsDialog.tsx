import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import makeStyles from '@mui/styles/makeStyles';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Error from '@mui/icons-material/Error';
import React, { ReactElement, useContext, useMemo, useState } from 'react';
import {
    containsYearTerm,
    CourseListItem,
    DayOfWeek,
    dayOfWeekToString,
    DayPeriod,
    Term,
    termToString,
    YearTerm,
} from '../../../common/waseda/course/course';
import { range } from '../../../common/util/util';
import { CourseOverviewContext } from './../CourseOverview';
import { CourseDataEntry, registerCourseData } from '../../../common/waseda/course/course-data';
import { useCallback } from 'react';
import { DeepReadonly } from '../../../common/util/types';

type Props = {
    open: boolean;
    course: CourseListItem;
    onClose: () => void;
};
type TimetableSettingsEntry = {
    yearTerm: YearTerm;
    dayPeriod: DayPeriod;
};
type TimetableConflict =
    | number /*〜番目の項目と競合している*/
    | CourseListItem /*コース〜と競合している*/
    | null /*競合していない*/;

const useStyles = makeStyles((theme) => ({
    tableCell: {
        padding: theme.spacing(1),
    },
    inputYear: {
        minWidth: '4em',
    },
    errorTooltip: {
        fontSize: theme.typography.body1.fontSize,
    },
}));

export default React.memo(function TimetableSettingsDialog(props: Props): ReactElement {
    return <Dialog open={props.open}>{props.open && <TimetableSettingsDialogContent {...props} />}</Dialog>;
});

function TimetableSettingsDialogContent(props: Props): ReactElement {
    const context = useContext(CourseOverviewContext);
    const [settingsEntries, setSettingsEntries] = useState<DeepReadonly<TimetableSettingsEntry[]>>(
        context.courseData[props.course.id]?.timetableData ?? []
    );
    const conflicts = useMemo(
        () => findConflicts(context.courseData, settingsEntries, context.courseList, props.course),
        [context.courseData, settingsEntries, context.courseList, props.course]
    );
    const [showAlertConflict, setShowAlertConflict] = useState(false);

    const classes = useStyles();

    const handleEntryChange = (index: number, entry: TimetableSettingsEntry) => {
        const newEntries = [...settingsEntries];
        newEntries[index] = entry;
        setSettingsEntries(newEntries);
    };
    const handleAddEntry = useCallback(() => {
        const newEntries = [...settingsEntries];
        newEntries.push({
            yearTerm: {
                year: new Date().getFullYear(),
                term: 'full_year',
            },
            dayPeriod: {
                day: 'monday',
                period: {
                    from: 1,
                    to: 1,
                },
            },
        });
        setSettingsEntries(newEntries);
    }, [settingsEntries]);
    const handleDeleteEntry = (index: number) => {
        const newEntries = [...settingsEntries];
        newEntries.splice(index, 1);
        setSettingsEntries(newEntries);
    };
    const handleCancel = useCallback(() => {
        props.onClose();
    }, [props]);
    const handleOK = useCallback(() => {
        if (conflicts.some((c) => c !== null)) {
            setShowAlertConflict(true);
            return;
        }

        registerCourseData(props.course.id, 'timetableData', settingsEntries);
        props.onClose();
    }, [conflicts, props, settingsEntries]);
    const handleClose = useCallback(() => setShowAlertConflict(false), []);

    return (
        <>
            <DialogTitle>
                {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogTitle', props.course.name)}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogDescription')}
                </DialogContentText>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    padding="none"
                                    align="center"
                                    classes={{ root: classes.tableCell }}
                                ></TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>
                                    {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogYearHeader')}
                                </TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>
                                    {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogTermHeader')}
                                </TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>
                                    {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogDayHeader')}
                                </TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>
                                    {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogPeriodFromHeader')}
                                </TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>
                                    {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogPeriodToHeader')}
                                </TableCell>
                                <TableCell
                                    padding="none"
                                    align="center"
                                    classes={{ root: classes.tableCell }}
                                ></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {settingsEntries.map((entry, index) => (
                                <TimetableSettingsEntryComponent
                                    key={index}
                                    settingsEntry={entry}
                                    conflict={conflicts[index]}
                                    onChange={(entry) => handleEntryChange(index, entry)}
                                    onDelete={() => handleDeleteEntry(index)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid container justifyContent="center">
                    <Grid item>
                        <Button variant="outlined" startIcon={<Add />} onClick={handleAddEntry}>
                            {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogAddEntryButton')}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleCancel}>
                    {browser.i18n.getMessage('cancel')}
                </Button>
                <Button color="primary" onClick={handleOK}>
                    {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogOK')}
                </Button>
            </DialogActions>

            <Dialog open={showAlertConflict} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        {browser.i18n.getMessage('courseOverviewTimetableSettingsCannotSetDueToConflict')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                        {browser.i18n.getMessage('ok')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

type TimetableSettingsEntryComponentProps = {
    settingsEntry: TimetableSettingsEntry;
    conflict: TimetableConflict;
    onChange: (settingsEntry: TimetableSettingsEntry) => void;
    onDelete: () => void;
};
function TimetableSettingsEntryComponent(props: TimetableSettingsEntryComponentProps): ReactElement {
    const classes = useStyles();

    const handleYearChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            props.onChange({
                yearTerm: {
                    year: parseInt(event.target.value),
                    term: props.settingsEntry.yearTerm.term,
                },
                dayPeriod: props.settingsEntry.dayPeriod,
            });
        },
        [props]
    );
    const handleTermChange = useCallback(
        (event: SelectChangeEvent<Term>) => {
            props.onChange({
                yearTerm: {
                    year: props.settingsEntry.yearTerm.year,
                    term: event.target.value as Term,
                },
                dayPeriod: props.settingsEntry.dayPeriod,
            });
        },
        [props]
    );
    const handleDayChange = useCallback(
        (event: SelectChangeEvent<DayOfWeek>) => {
            props.onChange({
                yearTerm: props.settingsEntry.yearTerm,
                dayPeriod: {
                    day: event.target.value as DayOfWeek,
                    period: props.settingsEntry.dayPeriod.period,
                },
            });
        },
        [props]
    );
    const handlePeriodFromChange = useCallback(
        (event: SelectChangeEvent<number>) => {
            props.onChange({
                yearTerm: props.settingsEntry.yearTerm,
                dayPeriod: {
                    day: props.settingsEntry.dayPeriod.day,
                    period: {
                        from: event.target.value as number,
                        to: event.target.value as number,
                    },
                },
            });
        },
        [props]
    );
    const handlePeriodToChange = useCallback(
        (event: SelectChangeEvent<number>) => {
            props.onChange({
                yearTerm: props.settingsEntry.yearTerm,
                dayPeriod: {
                    day: props.settingsEntry.dayPeriod.day,
                    period: {
                        from: props.settingsEntry.dayPeriod.period.from,
                        to: event.target.value as number,
                    },
                },
            });
        },
        [props]
    );

    return (
        <TableRow>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                {props.conflict !== null && (
                    <Tooltip
                        title={
                            typeof props.conflict === 'number'
                                ? browser.i18n.getMessage(
                                      'courseOverviewTimetableSettingsConflictWithAnotherRow',
                                      (props.conflict + 1).toString()
                                  )
                                : browser.i18n.getMessage(
                                      'courseOverviewTimetableSettingsConflictWithAnotherCourse',
                                      props.conflict.name
                                  )
                        }
                        classes={{ tooltip: classes.errorTooltip }}
                    >
                        <SvgIcon color="error">
                            {' '}
                            <Error />
                        </SvgIcon>
                    </Tooltip>
                )}
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Input
                    type="number"
                    value={props.settingsEntry.yearTerm.year}
                    onChange={handleYearChange}
                    classes={{ root: classes.inputYear }}
                />
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select
                    value={props.settingsEntry.yearTerm.term}
                    onChange={handleTermChange}
                    autoWidth
                    variant="standard"
                >
                    {[
                        'full_year',
                        'spring_semester',
                        'fall_semester',
                        'spring_quarter',
                        'summer_quarter',
                        'fall_quarter',
                        'winter_quarter',
                    ].map((term) => (
                        <MenuItem key={term} value={term}>
                            {termToString(term as Term)}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select
                    value={props.settingsEntry.dayPeriod.day}
                    onChange={handleDayChange}
                    autoWidth
                    variant="standard"
                >
                    {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                        <MenuItem key={day} value={day}>
                            {dayOfWeekToString(day as DayOfWeek)}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select
                    value={props.settingsEntry.dayPeriod.period.from}
                    onChange={handlePeriodFromChange}
                    autoWidth
                    variant="standard"
                >
                    {range(1, 8).map((period) => (
                        <MenuItem key={period} value={period}>
                            {browser.i18n.getMessage('period', period.toString())}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select
                    value={props.settingsEntry.dayPeriod.period.to}
                    onChange={handlePeriodToChange}
                    autoWidth
                    variant="standard"
                >
                    {range(props.settingsEntry.dayPeriod.period.from, 8).map((period) => (
                        <MenuItem key={period} value={period}>
                            {browser.i18n.getMessage('period', period.toString())}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <IconButton onClick={props.onDelete} size="large">
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

function findConflicts(
    courseData: DeepReadonly<Record<number, CourseDataEntry | undefined>>,
    settingsEntries: DeepReadonly<TimetableSettingsEntry[]>,
    courseList: CourseListItem[],
    course: CourseListItem
): TimetableConflict[] {
    return settingsEntries.map((settingsEntry, i) => {
        for (const [id, courseDataEntry] of Object.entries(courseData)) {
            if (id === course.id.toString()) continue;
            for (const { yearTerm, dayPeriod } of courseDataEntry?.timetableData ?? []) {
                if (
                    (containsYearTerm(yearTerm, settingsEntry.yearTerm) ||
                        containsYearTerm(settingsEntry.yearTerm, yearTerm)) &&
                    dayPeriod.day === settingsEntry.dayPeriod.day &&
                    dayPeriod.period.from <= settingsEntry.dayPeriod.period.to &&
                    settingsEntry.dayPeriod.period.from <= dayPeriod.period.to
                ) {
                    const conflictWith = courseList.find((c) => c.id.toString() === id);
                    if (conflictWith) return conflictWith;
                }
            }
        }

        for (let j = 0; j < i; j++) {
            if (
                (containsYearTerm(settingsEntries[j].yearTerm, settingsEntry.yearTerm) ||
                    containsYearTerm(settingsEntry.yearTerm, settingsEntries[j].yearTerm)) &&
                settingsEntries[j].dayPeriod.day === settingsEntry.dayPeriod.day &&
                settingsEntries[j].dayPeriod.period.from <= settingsEntry.dayPeriod.period.to &&
                settingsEntry.dayPeriod.period.from <= settingsEntries[j].dayPeriod.period.to
            ) {
                return j;
            }
        }

        return null;
    });
}
