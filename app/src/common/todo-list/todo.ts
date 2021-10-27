import React from 'react';
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

export async function* getToDoItems(forceUpdate?: boolean): AsyncGenerator<ToDoItem<any>[], void, undefined> {
    const generators: (AsyncGenerator<ToDoItem<any>[], ToDoItem<any>[] | void, undefined> | undefined)[] = [
        getToDoItemsFromMoodleTimeline(forceUpdate),
        getUserAddedToDoItems(),
    ];
    const values: ToDoItem<any>[][] = new Array(generators.length).map(() => []);

    for (;;) {
        const next = await Promise.all(generators.map((g) => g?.next()));
        for (let i = next.length - 1; i >= 0; i--) {
            const n = next[i];
            if (!n) continue;
            if (n.done) {
                generators[i] = undefined;
            }
            if (n.value) {
                values[i] = n.value;
            }
        }
        yield values.flat();
        if (generators.every((g) => g === undefined)) {
            break;
        }
    }
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
