import SvgIcon from '@mui/material/SvgIcon';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import React from 'react';
import { getConfig, setConfig } from '../config/config';
import { openAddToDoItemPage, ToDoItem } from './todo';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import makeStyles from '@mui/styles/makeStyles';

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

export async function* getUserAddedToDoItems(): AsyncGenerator<
    ToDoItem<UserAddedToDoItem>[],
    ToDoItem<UserAddedToDoItem>[],
    undefined
> {
    const items = getConfig('todo.userItems').map((item) => ({
        id: item.id,
        Icon,
        category: item.category,
        categoryHref:
            item.courseId !== undefined ? `https://wsdmoodle.waseda.jp/course/view.php?id=${item.courseId}` : undefined,
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
    return items;
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
