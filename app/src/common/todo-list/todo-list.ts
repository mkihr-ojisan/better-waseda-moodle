import { FunctionComponent } from 'react';

export type TodoListItem = {
    category: string;
    timestamp: Date;
    Icon: FunctionComponent<TodoListItemIconProps>;
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
export type TodoListItemIconProps = {
    size: number;
    item: TodoListItem;
};

const todoListProviders: (() => Promise<TodoListItem[]>)[] = [];

export async function getTodoList(): Promise<TodoListItem[]> {
    return (await Promise.all(todoListProviders.map(provider => provider()))).flat();
}