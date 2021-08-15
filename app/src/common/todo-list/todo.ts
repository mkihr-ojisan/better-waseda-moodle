import React from 'react';
import { CachedPromise, createCachedPromise } from '../util/ExPromise';
import { AlertColor } from '../util/types';
import { getToDoItemsFromMoodleTimeline } from './moodle-timeline';

export type ToDoItem<T = undefined> = {
    id: string;
    Icon: React.FC<ToDoItemIconProps<T>>;
    category?: string;
    categoryHref?: string;
    title: string;
    titleHref?: string;
    actions: ToDoItemAction<T>[];
    dueDate?: Date;
    data: T;
};

export type ToDoItemAction<T> = {
    Icon?: React.FC<ToDoItemActionIconProps<T>>;
    title: string;
    onAction: (item: ToDoItem) => ToDoItemActionReturn | undefined;
    divider?: boolean /* trueなら下に<Divider />を挟む */;
};

export type ToDoItemActionReturn = {
    closePopup?: boolean;
    refreshList?: boolean;
    showSnackbar?: {
        message: string;
        severity: AlertColor;
    };
};

export type ToDoItemIconProps<T> = {
    item: ToDoItem<T>;
};

export type ToDoItemActionIconProps<T> = {
    item: ToDoItem<T>;
    action: ToDoItemAction<T>;
};

export function getToDoItems(): CachedPromise<ToDoItem<any>[]> {
    return createCachedPromise(async (resolveCache) => {
        const promises: CachedPromise<ToDoItem<any>[]>[] = [getToDoItemsFromMoodleTimeline()];
        resolveCache((await Promise.all(promises.map((p) => p.cachedValue))).flat());

        return (await Promise.all(promises)).flat();
    });
}
