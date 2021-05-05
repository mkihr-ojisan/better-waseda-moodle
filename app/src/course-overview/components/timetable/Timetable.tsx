import { makeStyles } from '@material-ui/core';
import React, { ReactElement, ReactNode, useContext, useMemo } from 'react';
import { containsYearTerm, DayOfWeek, dayOfWeekToShortString, YearTerm } from '../../../common/waseda/course/course';
import useViewportHeight from '../../../common/react/useViewportHeight';
import { CourseOverviewContext, CourseOverviewContextProps } from '../CourseOverview';
import TimetableCourseCard from './TimetableCourseCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

type Props = {
    selectedTerm: YearTerm;
    showPeriodTime: boolean;
};

const useStyles = makeStyles(theme => ({
    table: {
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),

        '& tr:first-child': {
            height: '1em',
        },
        '& th:first-child': {
            width: '1em',
        },
        '& td, th': {
            border: 'solid 1px gray',
            padding: 0,
        },
        '& td > div': {
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(1),
            },
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1) / 4,
            },
            boxSizing: 'border-box',
        },
        '& th': {
            textAlign: 'center',
        },
    },
    tableWithPeriodTime: {
        '& th:first-child': {
            width: '3em',
            position: 'relative',
        },
        '& th:first-child > div': {
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        },
    },
}));

export default function Timetable(props: Props): ReactElement {
    const context = useContext(CourseOverviewContext);
    const classes = useStyles();
    const {
        timetableCells,
        showSaturday,
        showSunday,
        show6thPeriod,
        show7thPeriod,
    } = useTimetableCells(context, props.selectedTerm);

    const weekdays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const time = [
        ['9:00', '10:30'],
        ['10:40', '12:10'],
        ['13:00', '14:30'],
        ['14:45', '16:15'],
        ['16:30', '18:00'],
        ['18:15', '19:45'],
        ['19:55', '21:25'],
    ];

    // この辺そもそも下手くそな書き方な上に機能を後から付け足していってかなり汚くなっているのでいつか書き直さねばならない
    return (
        <table className={classes.table + (props.showPeriodTime ? ` ${classes.tableWithPeriodTime}` : '')}>
            <thead>
                <tr>
                    <th></th>
                    {weekdays.map(day => <th key={day}>{dayOfWeekToShortString(day)}</th>)}
                    {showSaturday && <th>{dayOfWeekToShortString('saturday')}</th>}
                    {showSunday && <th>{dayOfWeekToShortString('sunday')}</th>}
                </tr>
            </thead>
            <tbody>
                {
                    [0, 1, 2, 3, 4].map(period => (
                        <tr key={period}>
                            <th title={props.showPeriodTime ? undefined : time[period].join(' - ')}>
                                <Grid container direction="column" justify="space-between">
                                    {
                                        props.showPeriodTime ?
                                            <Grid item>
                                                <Typography variant="caption">
                                                    {time[period][0]}
                                                </Typography>
                                            </Grid> :
                                            null
                                    }
                                    <Grid item>
                                        {period + 1}
                                    </Grid>
                                    {
                                        props.showPeriodTime ?
                                            <Grid item>
                                                <Typography variant="caption">
                                                    {time[period][1]}
                                                </Typography>
                                            </Grid> :
                                            null
                                    }
                                </Grid>
                            </th>
                            {weekdays.map(day => timetableCells[day][period].node)}
                            {showSaturday && timetableCells['saturday'][period].node}
                            {showSunday && timetableCells['sunday'][period].node}
                        </tr>
                    ))
                }
                {
                    show6thPeriod &&
                    <tr>
                        <th title={props.showPeriodTime ? undefined : time[5].join(' - ')}>
                            <Grid container direction="column" justify="space-between">
                                {
                                    props.showPeriodTime ?
                                        <Grid item>
                                            <Typography variant="caption">
                                                {time[5][0]}
                                            </Typography>
                                        </Grid> :
                                        null
                                }
                                <Grid item>
                                    {6}
                                </Grid>
                                {
                                    props.showPeriodTime ?
                                        <Grid item>
                                            <Typography variant="caption">
                                                {time[5][1]}
                                            </Typography>
                                        </Grid> :
                                        null
                                }
                            </Grid>
                        </th>
                        {weekdays.map(day => timetableCells[day][5].node)}
                        {showSaturday && timetableCells['saturday'][5].node}
                        {showSunday && timetableCells['sunday'][5].node}
                    </tr>
                }
                {
                    show7thPeriod &&
                    <tr>
                        <th title={props.showPeriodTime ? undefined : time[6].join(' - ')}>
                            <Grid container direction="column" justify="space-between">
                                {
                                    props.showPeriodTime ?
                                        <Grid item>
                                            <Typography variant="caption">
                                                {time[6][0]}
                                            </Typography>
                                        </Grid> :
                                        null
                                }
                                <Grid item>
                                    {7}
                                </Grid>
                                {
                                    props.showPeriodTime ?
                                        <Grid item>
                                            <Typography variant="caption">
                                                {time[6][1]}
                                            </Typography>
                                        </Grid> :
                                        null
                                }
                            </Grid>
                        </th>
                        {weekdays.map(day => timetableCells[day][6].node)}
                        {showSaturday && timetableCells['saturday'][6].node}
                        {showSunday && timetableCells['sunday'][6].node}
                    </tr>
                }
            </tbody>
        </table>
    );
}

function useTimetableCells(context: CourseOverviewContextProps, selectedTerm: YearTerm) {
    const viewportHeight = useViewportHeight();

    return useMemo(
        () => {
            let showSunday = false;
            let showSaturday = false;
            let show6thPeriod = false;
            let show7thPeriod = false;
            for (const course of context.courseList) {
                if (course.isHidden) continue;

                for (const { yearTerm, dayPeriod } of context.courseData[course.id]?.timetableData ?? []) {
                    if (containsYearTerm(yearTerm, selectedTerm)) {
                        if (dayPeriod.day === 'saturday') {
                            showSaturday = true;
                        } else if (dayPeriod.day === 'sunday') {
                            showSaturday = showSunday = true;
                        }
                        if (dayPeriod.period.to === 7) {
                            show6thPeriod = show7thPeriod = true;
                        } else if (dayPeriod.period.to === 6) {
                            show6thPeriod = true;
                        }
                    }
                }
            }

            const timetableRowCount = show6thPeriod ? (show7thPeriod ? 7 : 6) : 5;
            const timetableRowHeight = (rowspan: number) => {
                return (Math.max((viewportHeight - 250) / timetableRowCount, 80) * rowspan + (rowspan - 1)) + 'px';
            };

            const timetableCells: Record<string, { node: ReactNode, isEmpty: boolean; }[]> = {};
            for (const day of ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']) {
                timetableCells[day] = [];
                for (let period = 1; period <= 7; period++) {
                    timetableCells[day][period - 1] = {
                        node: (
                            <td key={day}>
                                <div style={{ height: timetableRowHeight(1) }}></div>
                            </td>
                        ),
                        isEmpty: true,
                    };
                }
            }

            for (const course of context.courseList) {
                if (course.isHidden) continue;

                for (const { yearTerm, dayPeriod } of context.courseData[course.id]?.timetableData ?? []) {
                    if (containsYearTerm(yearTerm, selectedTerm)) {
                        const length = dayPeriod.period.to - dayPeriod.period.from + 1;
                        timetableCells[dayPeriod.day][dayPeriod.period.from - 1] = {
                            node: (
                                <td key={dayPeriod.day} rowSpan={length}>
                                    <div style={{ height: timetableRowHeight(length) }}>
                                        <TimetableCourseCard course={course} />
                                    </div>
                                </td>
                            ),
                            isEmpty: false,
                        };
                        for (let period = dayPeriod.period.from; period < dayPeriod.period.to; period++) {
                            timetableCells[dayPeriod.day][period] = {
                                node: null,
                                isEmpty: false,
                            };
                        }
                    }
                }
            }

            return {
                timetableCells,
                showSaturday,
                showSunday,
                show6thPeriod,
                show7thPeriod,
            };
        },
        [context.courseList, context.courseData, selectedTerm, viewportHeight],
    );
}

/*function useHighlightedDayPeriod(): { day: DayOfWeek, period: number | null; } {
    function getHighlightedDayPeriodRemain() {
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 9);

        // now.getUTC... で日本時間
        const day = (['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as DayOfWeek[])[now.getUTCDay()];

        const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
        let period, remain;
        if (minutes < 9 * 60) {
            period = null;
            remain = 9 * 60 - minutes;
        } else if (minutes < 10 * 60 + 30) {
            period = 1;
            remain = 10 * 60 + 30 - minutes;
        } else if (minutes < 12 * 60 + 10) {
            period = 2;
            remain = 12 * 60 + 10 - minutes;
        } else if (minutes < 14 * 60 + 30) {
            period = 3;
            remain = 14 * 60 + 30 - minutes;
        } else if (minutes < 16 * 60 + 15) {
            period = 4;
            remain = 16 * 60 + 15 - minutes;
        } else if (minutes < 18 * 60) {
            period = 5;
            remain = 18 * 60 - minutes;
        } else if (minutes < 19 * 60 + 45) {
            period = 6;
            remain = 19 * 60 + 45 - minutes;
        } else if (minutes < 21 * 60 + 25) {
            period = 7;
            remain = 21 * 60 + 25 - minutes;
        } else {
            period = null;
            remain = (24 + 9) * 60 - minutes;
        }

        return { day, period, remain };
    }

    const [state, setState] = useState(() => getHighlightedDayPeriodRemain());
    useEffect(() => {
        const timeoutId = setTimeout(
            () => setState(getHighlightedDayPeriodRemain()),
            state.remain * 60 * 1000,
        );
        return () => clearTimeout(timeoutId);
    });

    return state;
}*/