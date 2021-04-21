import { FunctionComponent } from 'react';

export type TodoListItem<T = undefined> = {
    category: string;
    timestamp: Date;
    Icon: FunctionComponent<TodoListItemIconProps<T>>;
    title: string;
    content: string;
    actions: TodoListItemAction[];
    SelectRemoveOptionDialog: FunctionComponent<SelectRemoveOptionDialogProps<T>>;
    data: T;
};

export type TodoListItemAction = {
    message: string;
    onClick: () => void;
};

export type SelectRemoveOptionDialogProps<T> = {
    open: boolean;
    onClose: () => void;
    item: TodoListItem<T>;
};
export type TodoListItemIconProps<T> = {
    size: number;
    item: TodoListItem<T>;
};

const todoListProviders: (() => Promise<TodoListItem[]>)[] = [];

export async function getTodoList(): Promise<TodoListItem[]> {
    return (await Promise.all(todoListProviders.map(provider => provider()))).flat();
}