import React from 'react';
import { CachedPromise, createCachedPromise } from '../util/ExPromise';
import { AlertColor } from '../util/types';
import { getToDoItemsFromMoodleTimeline } from './moodle-timeline';
import { getUserAddedToDoItems } from './user-added-items';

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
    onAction: (item: ToDoItem<T>) => ToDoItemActionReturn | undefined;
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

export function getToDoItems(forceUpdate?: boolean): CachedPromise<ToDoItem<any>[]> {
    return createCachedPromise(async (resolveCache) => {
        const promises: CachedPromise<ToDoItem<any>[]>[] = [
            getToDoItemsFromMoodleTimeline(forceUpdate),
            getUserAddedToDoItems(),
        ];
        resolveCache(sortToDoItems((await Promise.all(promises.map((p) => p.cachedValue))).flat()));

        return sortToDoItems((await Promise.all(promises)).flat());
    });
}

export function sortToDoItems<T>(items: ToDoItem<T>[]): ToDoItem<T>[] {
    items.sort((a, b) => (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0));
    return items;
}

export type OpenAddToDoItemPageOptions = {
    id?: string;
    defaultIconUrl?: string;
    defaultCategory?: string;
    defaultCourseId?: number;
    defaultTitle?: string;
    defaultTitleHref?: string;
    defaultDueDate?: number;
};

export function openAddToDoItemPage(options?: OpenAddToDoItemPageOptions): void {
    const query = options ? encodeURIComponent(JSON.stringify(options)) : '';

    window.open(
        browser.runtime.getURL(`src/common/todo-list/add-todo-item-page/add-todo-item-page.html?${query}`),
        'addToDoItemPage',
        'width=500,height=500,scrollbars=yes'
    );
}
