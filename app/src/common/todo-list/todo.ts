import React from 'react';
import { CachedPromise, createCachedPromise } from '../util/ExPromise';

export type TodoItem = {
    id: string;
    Icon: React.FC;
    category?: string;
    categoryHref?: string;
    title: string;
    titleHref?: string;
    actions: TodoItemAction[];
    dueDate?: Date;
};

export type TodoItemAction = {
    Icon: React.FC;
    title: string;
    onAction: (item: TodoItem) => TodoItemActionReturn | undefined;
    divider?: boolean /* trueなら下に<Divider />を挟む */;
};

export type TodoItemActionReturn = {
    closePopup?: boolean;
    refreshList?: boolean;
};

export function getTodoItems(): CachedPromise<TodoItem[]> {
    return createCachedPromise(async (resolveCache) => {
        resolveCache([]);
        return [];
    });
}
