import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { ReactElement } from 'react';
import { MessengerClient } from '../util/messenger';
import { ActionEvent } from '../waseda/calendar';
import { ToDoItem, ToDoItemAction, ToDoItemIconProps } from './todo';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getConfig, setConfig } from '../config/config';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export async function* getToDoItemsFromMoodleTimeline(
    forceUpdate?: boolean
): AsyncGenerator<ToDoItem<ActionEvent>[], void, undefined> {
    const generator = (await MessengerClient.exec('fetchActionEventsByTimeSort', {
        forceUpdate,
    })) as AsyncGenerator<ActionEvent[]>;

    for await (const items of generator) {
        yield filterOutHiddenEvents(items).map(actionEventToToDoItem);
    }
}

function filterOutHiddenEvents(events: ActionEvent[]): ActionEvent[] {
    const hiddenItems = getConfig('todo.hiddenItems');

    // 時が経って流れた項目は、hiddenItemsから削除する
    const newHiddenIds = hiddenItems.ids.filter((id) => events.some((event) => event.id === id));
    if (hiddenItems.ids.length > newHiddenIds.length) {
        setConfig('todo.hiddenItems', { ...hiddenItems, ids: newHiddenIds });
    }

    return events.filter(
        (event) =>
            !hiddenItems.courses.includes(event.course.id) &&
            !hiddenItems.ids.includes(event.id) &&
            !hiddenItems.modules.includes(event.modulename)
    );
}

function actionEventToToDoItem(event: ActionEvent): ToDoItem<ActionEvent> {
    const actions: ToDoItemAction<ActionEvent>[] = [];

    if (event.action?.actionable) {
        actions.push({
            title: event.action.name,
            divider: true,
            Icon: OpenInNewIcon,
            onAction: () => {
                window.open(event.action.url, '_blank');
                return { closePopup: true };
            },
        });
    }

    actions.push(
        {
            title: browser.i18n.getMessage('popupHideItem'),
            Icon: VisibilityOffIcon,
            onAction: () => {
                const value = getConfig('todo.hiddenItems');
                const newValue = {
                    ...value,
                    ids: [...value.ids, event.id],
                };
                setConfig('todo.hiddenItems', newValue);

                if (!getConfig('todo.hideItemNoticeShown')) {
                    setConfig('todo.hideItemNoticeShown', true);
                    return {
                        refreshList: true,
                        showSnackbar: {
                            message: browser.i18n.getMessage('popupHideNotice'),
                            severity: 'info',
                        },
                    };
                } else {
                    return { refreshList: true };
                }
            },
        },
        {
            title: browser.i18n.getMessage('popupHideCourse'),
            onAction: () => {
                const value = getConfig('todo.hiddenItems');
                const newValue = {
                    ...value,
                    courses: [...value.courses, event.course.id],
                };
                setConfig('todo.hiddenItems', newValue);

                if (!getConfig('todo.hideItemNoticeShown')) {
                    setConfig('todo.hideItemNoticeShown', true);
                    return {
                        refreshList: true,
                        showSnackbar: {
                            message: browser.i18n.getMessage('popupHideNotice'),
                            severity: 'info',
                        },
                    };
                } else {
                    return { refreshList: true };
                }
            },
        },
        {
            title: browser.i18n.getMessage('popupHideType'),
            onAction: () => {
                const value = getConfig('todo.hiddenItems');
                const newValue = {
                    ...value,
                    modules: [...value.modules, event.modulename],
                };
                setConfig('todo.hiddenItems', newValue);

                if (!getConfig('todo.hideItemNoticeShown')) {
                    setConfig('todo.hideItemNoticeShown', true);
                    return {
                        refreshList: true,
                        showSnackbar: {
                            message: browser.i18n.getMessage('popupHideNotice'),
                            severity: 'info',
                        },
                    };
                } else {
                    return { refreshList: true };
                }
            },
        }
    );

    return {
        id: `moodle-action-event-${event.id}`,
        Icon,
        category: event.course.fullname,
        categoryHref: event.course.viewurl,
        title: event.name,
        titleHref: event.url,
        actions,
        dueDate: new Date(event.timesort * 1000),
        data: event,
    };
}

const useStyles = makeStyles(() => ({
    icon: {
        width: '100%',
        height: '100%',
    },
}));

function Icon(props: ToDoItemIconProps<ActionEvent>): ReactElement {
    const classes = useStyles();
    return (
        <img
            src={`https://wsdmoodle.waseda.jp/theme/image.php/boost/${props.item.data.icon.component}/1618418996/${props.item.data.icon.key}`}
            className={classes.icon}
        />
    );
}
