import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Error from '@material-ui/icons/Error';
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
    const [settingsEntries, setSettingsEntries] = useState<TimetableSettingsEntry[]>(
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
        (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
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
        (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
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
        (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
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
        (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
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
                <Select value={props.settingsEntry.yearTerm.term} onChange={handleTermChange} autoWidth>
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
                <Select value={props.settingsEntry.dayPeriod.day} onChange={handleDayChange} autoWidth>
                    {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                        <MenuItem key={day} value={day}>
                            {dayOfWeekToString(day as DayOfWeek)}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select value={props.settingsEntry.dayPeriod.period.from} onChange={handlePeriodFromChange} autoWidth>
                    {range(1, 8).map((period) => (
                        <MenuItem key={period} value={period}>
                            {browser.i18n.getMessage('period', period.toString())}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select value={props.settingsEntry.dayPeriod.period.to} onChange={handlePeriodToChange} autoWidth>
                    {range(props.settingsEntry.dayPeriod.period.from, 8).map((period) => (
                        <MenuItem key={period} value={period}>
                            {browser.i18n.getMessage('period', period.toString())}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <IconButton onClick={props.onDelete}>
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

function findConflicts(
    courseData: Record<number, CourseDataEntry | undefined>,
    settingsEntries: TimetableSettingsEntry[],
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
