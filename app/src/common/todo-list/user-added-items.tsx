import SvgIcon from '@material-ui/core/SvgIcon';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import React from 'react';
import { getConfig, setConfig } from '../config/config';
import { CachedPromise, createCachedPromise } from '../util/ExPromise';
import { openAddToDoItemPage, ToDoItem } from './todo';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

export type UserAddedToDoItem = {
    id: string;
    iconUrl?: string;
    category?: string;
    courseId?: number;
    title: string;
    titleHref?: string;
    dueDate?: number;
};

export function addOrUpdateToDoItem(item: UserAddedToDoItem): void {
    const currentValue = getConfig('todo.userItems');

    const index = currentValue.findIndex((i) => i.id === item.id);

    let newValue;
    if (index >= 0) {
        newValue = currentValue.map((i) => (i.id === item.id ? item : i));
    } else {
        newValue = [item, ...currentValue];
    }

    setConfig('todo.userItems', newValue);
}

export function removeToDoItem(itemId: string): void {
    const currentValue = getConfig('todo.userItems');
    const newValue = currentValue.filter((i) => i.id !== itemId);
    setConfig('todo.userItems', newValue);
}

export function getUserAddedToDoItems(): CachedPromise<ToDoItem<UserAddedToDoItem>[]> {
    return createCachedPromise((resolveCache) => {
        const items = getConfig('todo.userItems').map((item) => ({
            id: item.id,
            Icon,
            category: item.category,
            categoryHref:
                item.courseId !== undefined
                    ? `https://wsdmoodle.waseda.jp/course/view.php?id=${item.courseId}`
                    : undefined,
            title: item.title,
            titleHref: item.titleHref,
            actions: [
                {
                    Icon: EditIcon,
                    title: browser.i18n.getMessage('popupEditItem'),
                    onAction: (item: ToDoItem<UserAddedToDoItem>) => {
                        openAddToDoItemPage({
                            id: item.data.id,
                            defaultIconUrl: item.data.iconUrl,
                            defaultCategory: item.data.category,
                            defaultCourseId: item.data.courseId,
                            defaultTitle: item.data.title,
                            defaultTitleHref: item.data.titleHref,
                            defaultDueDate: item.data.dueDate,
                        });
                        return { closePopup: true };
                    },
                },
                {
                    Icon: DeleteIcon,
                    title: browser.i18n.getMessage('popupRemoveItem'),
                    onAction: (item: ToDoItem<UserAddedToDoItem>) => {
                        removeToDoItem(item.data.id);
                        return { refreshList: true };
                    },
                },
            ],
            dueDate: item.dueDate !== undefined ? new Date(item.dueDate) : undefined,
            data: item,
        }));
        resolveCache(items);
        return items;
    });
}

const useStyles = makeStyles(() => ({
    icon: {
        width: '100%',
        height: '100%',
    },
}));

const Icon = React.memo(function Icon({ item }: { item: ToDoItem<UserAddedToDoItem> }) {
    const classes = useStyles();
    return item.data.iconUrl ? (
        <img src={item.data.iconUrl} className={classes.icon} />
    ) : (
        <SvgIcon>
            <FiberManualRecordIcon />
        </SvgIcon>
    );
});
