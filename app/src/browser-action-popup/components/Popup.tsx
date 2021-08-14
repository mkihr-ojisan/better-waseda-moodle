import { makeStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, { ReactElement, useState } from 'react';
import { useCallback } from 'react';
import BWMThemePrefersColorScheme from '../../common/react/theme/BWMThemePrefersColorScheme';
import { useCachedPromise } from '../../common/react/usePromise';
import { getTodoItems } from '../../common/todo-list/todo';
import Header from './Header';
import TodoListView from './todo/TodoListView';

const useStyles = makeStyles(() => ({
    root: {
        display: 'grid',
        gridTemplateRows: '1fr 48px',
        width: '100%',
        height: '100%',
    },
}));

export default function Popup(): ReactElement | null {
    const classes = useStyles();

    const [refreshCounter, setRefreshCounter] = useState(0); //これをインクリメントすることでリストを更新する
    const [todoItems, state] = useCachedPromise(() => getTodoItems(), [refreshCounter]);

    const handleRefresh = useCallback(() => {
        setRefreshCounter((prev) => prev + 1);
    }, []);

    return (
        <BWMThemePrefersColorScheme>
            <CssBaseline />
            <div className={classes.root}>
                <TodoListView items={todoItems} onRefreshListRequest={handleRefresh} />
                <Header loading={state !== 'fulfilled'} onRefreshListRequest={handleRefresh} />
            </div>
        </BWMThemePrefersColorScheme>
    );
}
