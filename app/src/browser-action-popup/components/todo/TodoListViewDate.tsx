import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { TodoItem } from '../../../common/todo-list/todo';
import { format } from '../../../common/util/date';
import TodoListViewItem from './TodoListViewItem';

export type TodoListViewDateProps = {
    date?: Date;
    items: TodoItem[];
    onRefreshListRequest: () => void;
};

export default React.memo(function TodoListViewDate(props: TodoListViewDateProps) {
    return (
        <>
            <Grid item>
                <Typography variant="body1">
                    {props.date
                        ? format(props.date, browser.i18n.getMessage('dateFormatMonthDateDay'))
                        : browser.i18n.getMessage('popupIndefinite')}
                </Typography>
            </Grid>
            {props.items.map((item) => (
                <Grid item key={item.id}>
                    <TodoListViewItem todoItem={item} onRefreshListRequest={props.onRefreshListRequest} />
                </Grid>
            ))}
        </>
    );
});
