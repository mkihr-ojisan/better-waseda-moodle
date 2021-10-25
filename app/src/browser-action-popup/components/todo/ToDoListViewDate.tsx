import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ToDoItem } from '../../../common/todo-list/todo';
import { format } from '../../../common/util/date';
import { AlertColor } from '../../../common/util/types';
import ToDoListViewItem from './ToDoListViewItem';
import { isSameDay } from 'date-fns';
import clsx from 'clsx';

export type ToDoListViewDateProps = {
    date?: Date;
    items: ToDoItem[];
    onRefreshListRequest: () => void;
    handleShowSnackbar: (message: string, severity: AlertColor) => void;
};

const useStyles = makeStyles((theme) => ({
    date: {
        paddingBottom: '0 !important',
    },
    past: {
        color: theme.palette.error.main,
    },
}));

export default React.memo(function ToDoListViewDate(props: ToDoListViewDateProps) {
    const classes = useStyles();
    const isPast = props.date && !isSameDay(new Date(), props.date) && props.date < new Date();

    return (
        <>
            <Grid item className={classes.date}>
                <Typography variant="body2" className={clsx(isPast && classes.past)}>
                    {props.date
                        ? format(props.date, browser.i18n.getMessage('dateFormatMonthDateDay'))
                        : browser.i18n.getMessage('popupIndefinite')}
                </Typography>
            </Grid>
            {props.items.map((item) => (
                <Grid item key={item.id}>
                    <ToDoListViewItem
                        todoItem={item}
                        onRefreshListRequest={props.onRefreshListRequest}
                        handleShowSnackbar={props.handleShowSnackbar}
                    />
                </Grid>
            ))}
        </>
    );
});
