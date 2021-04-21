import { FunctionComponent, ReactNode } from 'react';

export type TodoListItem = {
    category: string;
    timestamp: Date;
    icon: ReactNode;
    title: string;
    content: string;
    actions: TodoListItemAction[];
    SelectRemoveOptionDialog: FunctionComponent<SelectRemoveOptionDialogProps>;
};

export type TodoListItemAction = {
    message: string;
    onClick: () => void;
};

export type SelectRemoveOptionDialogProps = {
    open: boolean;
    onClose: () => void;
    item: TodoListItem;
};

const todoListProviders: (() => Promise<TodoListItem[]>)[] = [];

export async function getTodoList(): Promise<TodoListItem[]> {
    return (await Promise.all(todoListProviders.map(provider => provider()))).flat();
}