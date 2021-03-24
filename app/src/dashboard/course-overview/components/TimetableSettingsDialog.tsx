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
import { containsYearTerm, CourseListItem, DayOfWeek, dayOfWeekToString, DayPeriod, Term, termToString, YearTerm } from '../../../common/course';
import { registerTimetableEntry, TimetableEntry } from '../../../common/timetable';
import { range } from '../../../common/util/util';
import { CourseOverviewContext } from './CourseOverview';

type Props = {
    open: boolean;
    course: CourseListItem;
    onClose: () => void;
};
type TimetableSettingsEntry = {
    term: YearTerm;
    dayPeriod: DayPeriod;
};
type TimetableConflict = number /*〜番目の項目と競合している*/ | CourseListItem /*コース〜と競合している*/ | null /*競合していない*/;

const useStyles = makeStyles(theme => ({
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

export default function TimetableSettingsDialog(props: Props): ReactElement {
    return (
        <Dialog open={props.open}>
            {props.open && <TimetableSettingsDialogContent {...props} />}
        </Dialog>
    );
}

function TimetableSettingsDialogContent(props: Props): ReactElement {
    const context = useContext(CourseOverviewContext);
    const [settingsEntries, setSettingsEntries] = useState<TimetableSettingsEntry[]>(context.timetableEntries.find(e => e[0] === props.course.id)?.[1] ?? []);
    const conflicts = useMemo(
        () => findConflicts(context.timetableEntries, settingsEntries, context.courseList, props.course),
        [context.timetableEntries, settingsEntries, context.courseList, props.course],
    );
    const [showAlertConflict, setShowAlertConflict] = useState(false);

    const classes = useStyles();

    function handleEntryChange(index: number, entry: TimetableSettingsEntry) {
        const newEntries = [...settingsEntries];
        newEntries[index] = entry;
        setSettingsEntries(newEntries);
    }
    function handleAddEntry() {
        const newEntries = [...settingsEntries];
        newEntries.push({
            term: {
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
    }
    function handleDeleteEntry(index: number) {
        const newEntries = [...settingsEntries];
        newEntries.splice(index, 1);
        setSettingsEntries(newEntries);
    }
    function handleCancel() {
        props.onClose();
    }
    function handleOK() {
        if (conflicts.some(c => c !== null)) {
            setShowAlertConflict(true);
            return;
        }

        registerTimetableEntry([props.course.id, settingsEntries]);
        props.onClose();
    }

    return (
        <>
            <DialogTitle>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogTitle', props.course.name)}</DialogTitle>
            <DialogContent>
                <DialogContentText>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogDescription')}</DialogContentText>
                <TableContainer component={Paper}>
                    <Table size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}></TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogYearHeader')}</TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogTermHeader')}</TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogDayHeader')}</TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogPeriodFromHeader')}</TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogPeriodToHeader')}</TableCell>
                                <TableCell padding="none" align="center" classes={{ root: classes.tableCell }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                settingsEntries.map((entry, index) => (
                                    <TimetableSettingsEntryComponent
                                        key={index}
                                        settingsEntry={entry}
                                        conflict={conflicts[index]}
                                        onChange={entry => handleEntryChange(index, entry)}
                                        onDelete={() => handleDeleteEntry(index)}
                                    />
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid container justify="center">
                    <Grid item>
                        <Button variant="outlined" startIcon={<Add />} onClick={handleAddEntry}>
                            {browser.i18n.getMessage('courseOverviewTimetableSettingsDialogAddEntryButton')}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleCancel}>{browser.i18n.getMessage('cancel')}</Button>
                <Button color="primary" onClick={handleOK}>{browser.i18n.getMessage('courseOverviewTimetableSettingsDialogOK')}</Button>
            </DialogActions>

            <Dialog open={showAlertConflict} onClose={() => setShowAlertConflict(false)}>
                <DialogContent>
                    <DialogContentText>{browser.i18n.getMessage('courseOverviewTimetableSettingsCannotSetDueToConflict')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setShowAlertConflict(false)}>{browser.i18n.getMessage('ok')}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

type TimetableSettingsEntryComponentProps = {
    settingsEntry: TimetableSettingsEntry,
    conflict: TimetableConflict,
    onChange: (settingsEntry: TimetableSettingsEntry) => void;
    onDelete: () => void;
};
function TimetableSettingsEntryComponent(props: TimetableSettingsEntryComponentProps): ReactElement {
    const classes = useStyles();

    function handleYearChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        props.onChange({
            term: {
                year: parseInt(event.target.value),
                term: props.settingsEntry.term.term,
            },
            dayPeriod: props.settingsEntry.dayPeriod,
        });
    }
    function handleTermChange(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        props.onChange({
            term: {
                year: props.settingsEntry.term.year,
                term: event.target.value as Term,
            },
            dayPeriod: props.settingsEntry.dayPeriod,
        });
    }
    function handleDayChange(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        props.onChange({
            term: props.settingsEntry.term,
            dayPeriod: {
                day: event.target.value as DayOfWeek,
                period: props.settingsEntry.dayPeriod.period,
            },
        });
    }
    function handlePeriodFromChange(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        props.onChange({
            term: props.settingsEntry.term,
            dayPeriod: {
                day: props.settingsEntry.dayPeriod.day,
                period: {
                    from: event.target.value as number,
                    to: event.target.value as number,
                },
            },
        });
    }
    function handlePeriodToChange(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        props.onChange({
            term: props.settingsEntry.term,
            dayPeriod: {
                day: props.settingsEntry.dayPeriod.day,
                period: {
                    from: props.settingsEntry.dayPeriod.period.from,
                    to: event.target.value as number,
                },
            },
        });
    }

    return (
        <TableRow>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                {
                    props.conflict !== null &&
                    <Tooltip
                        title={
                            typeof props.conflict === 'number'
                                ? browser.i18n.getMessage('courseOverviewTimetableSettingsConflictWithAnotherRow', props.conflict + 1)
                                : browser.i18n.getMessage('courseOverviewTimetableSettingsConflictWithAnotherCourse', props.conflict.name)
                        }
                        classes={{ tooltip: classes.errorTooltip }}
                    >
                        <SvgIcon color="error"> <Error /></SvgIcon>
                    </Tooltip>
                }
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Input type="number" value={props.settingsEntry.term.year} onChange={handleYearChange} classes={{ root: classes.inputYear }} />
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select value={props.settingsEntry.term.term} onChange={handleTermChange} autoWidth>
                    {['full_year', 'spring_semester', 'fall_semester', 'spring_quarter', 'summer_quarter', 'fall_quarter', 'winter_quarter'].map(term => <MenuItem key={term} value={term}>{termToString(term as Term)}</MenuItem>)}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select value={props.settingsEntry.dayPeriod.day} onChange={handleDayChange} autoWidth>
                    {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => <MenuItem key={day} value={day}>{dayOfWeekToString(day as DayOfWeek)}</MenuItem>)}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select value={props.settingsEntry.dayPeriod.period.from} onChange={handlePeriodFromChange} autoWidth>
                    {range(1, 8).map(period => <MenuItem key={period} value={period}>{browser.i18n.getMessage('period', period)}</MenuItem>)}
                </Select>
            </TableCell>
            <TableCell padding="none" classes={{ root: classes.tableCell }}>
                <Select value={props.settingsEntry.dayPeriod.period.to} onChange={handlePeriodToChange} autoWidth>
                    {range(props.settingsEntry.dayPeriod.period.from, 8).map(period => <MenuItem key={period} value={period}>{browser.i18n.getMessage('period', period)}</MenuItem>)}
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

function findConflicts(timetable: TimetableEntry[], settingsEntries: TimetableSettingsEntry[], courseList: CourseListItem[], course: CourseListItem): TimetableConflict[] {
    return settingsEntries.map((settingsEntry, i) => {
        for (const timetableEntry of timetable) {
            if (timetableEntry[0] === course.id) continue;
            for (const { term, dayPeriod } of timetableEntry[1]) {
                if (
                    (containsYearTerm(term, settingsEntry.term) || containsYearTerm(settingsEntry.term, term)) &&
                    dayPeriod.day === settingsEntry.dayPeriod.day &&
                    dayPeriod.period.from <= settingsEntry.dayPeriod.period.to &&
                    settingsEntry.dayPeriod.period.from <= dayPeriod.period.to
                ) {
                    const conflictWith = courseList.find(c => c.id === timetableEntry[0]);
                    if (conflictWith)
                        return conflictWith;
                }
            }
        }

        for (let j = 0; j < i; j++) {
            if (
                (containsYearTerm(settingsEntries[j].term, settingsEntry.term) || containsYearTerm(settingsEntry.term, settingsEntries[j].term)) &&
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