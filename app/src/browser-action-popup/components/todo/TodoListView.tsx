import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useMemo } from 'react';
import Center from '../../../common/react/Center';
import { TodoItem } from '../../../common/todo-list/todo';
import TodoListViewDate from './TodoListViewDate';

const useStyles = makeStyles(() => ({
    root: {
        overflowY: 'auto',
        width: '100%',
        margin: 0,
    },
}));

export type TodoListViewProps = {
    items: TodoItem[] | undefined;
    loading: boolean;
    onRefreshListRequest: () => void;
};

export default React.memo(function TodoListView(props: TodoListViewProps) {
    const classes = useStyles();

    const { dates, indefiniteItems } = useMemo(() => {
        if (!props.items) return { dates: [], indefiniteItems: [] };

        const dates: {
            date: Date;
            items: TodoItem[];
        }[] = [];
        const indefiniteItems: TodoItem[] = [];
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

    if (props.items && props.items.length > 0) {
        return (
            <Grid container direction="column" spacing={1} className={classes.root} wrap="nowrap">
                {indefiniteItems.length > 0 && (
                    <TodoListViewDate items={indefiniteItems} onRefreshListRequest={props.onRefreshListRequest} />
                )}
                {dates?.map(({ date, items }) => (
                    <TodoListViewDate
                        key={date.getFullYear() * 366 + date.getMonth() * 31 + date.getDate()}
                        date={date}
                        items={items}
                        onRefreshListRequest={props.onRefreshListRequest}
                    />
                ))}
            </Grid>
        );
    } else {
        return (
            <Center>
                <Typography variant="body2" color="textSecondary">
                    {browser.i18n.getMessage(props.loading ? 'popupEmptyMessageLoading' : 'popupEmptyMessage')}
                </Typography>
            </Center>
        );
    }
});
