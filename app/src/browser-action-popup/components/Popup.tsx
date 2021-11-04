import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { getToDoItems } from '../../common/todo-list/todo';
import Header from './Header';
import ToDoListView from './todo/ToDoListView';
import BWMRoot from '../../common/react/BWMRoot';
import { useAsyncGenerator } from '../../common/react/useAsyncGenerator';

const useStyles = makeStyles(() => ({
    root: {
        display: 'grid',
        gridTemplateRows: '1fr 48px',
        width: '100%',
        height: '100%',
    },
}));

export default React.memo(function Popup() {
    return (
        <BWMRoot>
            <PopupContent />
        </BWMRoot>
    );
});

const PopupContent = React.memo(function Popup() {
    const classes = useStyles();

    const [refreshCounter, setRefreshCounter] = useState(0); //これをインクリメントすることでリストを更新する
    const { value: items, done, error } = useAsyncGenerator(() => getToDoItems(refreshCounter !== 0), [refreshCounter]);

    const handleRefresh = useCallback(() => {
        setRefreshCounter((prev) => prev + 1);
    }, []);

    return (
        <div className={classes.root}>
            <ToDoListView
                loading={items === undefined}
                items={items}
                onRefreshListRequest={handleRefresh}
                error={error}
            />
            <Header loading={!done} onRefreshListRequest={handleRefresh} />
        </div>
    );
});
