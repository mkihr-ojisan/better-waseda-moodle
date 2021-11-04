import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import Center from '../../../common/react/Center';
import { ToDoItem } from '../../../common/todo-list/todo';
import { AlertColor } from '../../../common/util/types';
import ToDoListViewDate from './ToDoListViewDate';
import Box from '@mui/system/Box';
import { getErrorMessage } from '../../../common/util/util';

const useStyles = makeStyles(() => ({
    root: {
        overflowY: 'auto',
        width: '100%',
        margin: 0,
    },
    snackbar: {
        bottom: 56,
    },
}));

export type ToDoListViewProps = {
    items: ToDoItem[] | undefined;
    error: unknown | undefined;
    loading: boolean;
    onRefreshListRequest: () => void;
};

export default React.memo(function ToDoListView(props: ToDoListViewProps) {
    const classes = useStyles();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    const handleShowSnackbar = useCallback((message: string, severity: AlertColor) => {
        setSnackbarOpen(true);
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
    }, []);
    const handleCloseSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, []);
    useEffect(() => {
        if (props.error) {
            handleShowSnackbar(getErrorMessage(props.error), 'error');
        }
    }, [handleShowSnackbar, props.error]);

    const { dates, indefiniteItems } = useMemo(() => {
        if (!props.items) return { dates: [], indefiniteItems: [] };

        const dates: {
            date: Date;
            items: ToDoItem[];
        }[] = [];
        const indefiniteItems: ToDoItem[] = [];
        for (const item of props.items) {
            if (!item.dueDate) {
                indefiniteItems.push(item);
            } else if (dates.length > 0) {
                const prevDate = dates[dates.length - 1].date;
                if (
                    prevDate.getFullYear() === item.dueDate.getFullYear() &&
                    prevDate.getMonth() === item.dueDate.getMonth() &&
                    prevDate.getDate() === item.dueDate.getDate()
                ) {
                    dates[dates.length - 1].items.push(item);
                } else {
                    dates.push({ date: item.dueDate, items: [item] });
                }
            } else {
                dates.push({ date: item.dueDate, items: [item] });
            }
        }
        return { dates, indefiniteItems };
    }, [props.items]);

    return (
        <>
            {props.items && props.items.length > 0 ? (
                <Grid container direction="column" spacing={1} className={classes.root} wrap="nowrap">
                    {indefiniteItems.length > 0 && (
                        <ToDoListViewDate
                            items={indefiniteItems}
                            onRefreshListRequest={props.onRefreshListRequest}
                            handleShowSnackbar={handleShowSnackbar}
                        />
                    )}
                    {dates?.map(({ date, items }) => (
                        <ToDoListViewDate
                            key={date.getFullYear() * 366 + date.getMonth() * 31 + date.getDate()}
                            date={date}
                            items={items}
                            onRefreshListRequest={props.onRefreshListRequest}
                            handleShowSnackbar={handleShowSnackbar}
                        />
                    ))}
                    <Box pb={1} />
                </Grid>
            ) : (
                <Center>
                    <Typography variant="body2" color="textSecondary">
                        {browser.i18n.getMessage(props.loading ? 'popupEmptyMessageLoading' : 'popupEmptyMessage')}
                    </Typography>
                </Center>
            )}
            <Snackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                autoHideDuration={5000}
                className={classes.snackbar}
            >
                <Alert severity={snackbarSeverity} onClose={handleCloseSnackbar} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
});
