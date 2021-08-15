import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { MouseEventHandler } from 'react';
import { TodoItem, TodoItemAction } from '../../../common/todo-list/todo';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Center from '../../../common/react/Center';
import { useCallback } from 'react';
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import { AlertColor } from '../../../common/util/types';

export type TodoListViewItemProps = {
    todoItem: TodoItem;
    onRefreshListRequest: () => void;
    handleShowSnackbar: (message: string, severity: AlertColor) => void;
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        position: 'relative',
        height: 48,
        gridTemplateColumns: '48px 1fr 48px',
    },
    icon: {
        width: 48,
        height: 48,
        padding: 12,
    },
    titleCategoryTimeContainer: {
        overflow: 'hidden',
        width: '100%',
        flexWrap: 'nowrap',
    },
    titleCategory: {
        display: 'inline-block',
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        '&[href]:hover': {
            textDecoration: 'underline',
            color: theme.palette.primary.main,
        },
    },
    time: {
        display: 'inline-block',
        maxWidth: '100%',
    },
    spacer: {
        flexGrow: 1,
    },
    listItemIconRoot: {
        minWidth: 40,
    },
}));

export default React.memo(function TodoListViewItem(props: TodoListViewItemProps) {
    const classes = useStyles();

    const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
        const href = (event.target as HTMLAnchorElement).href;
        if (href) {
            window.open(href, '_blank');
            window.close();
            event.preventDefault();
        }
    }, []);

    const popupState = usePopupState({ variant: 'popover', popupId: 'todo-list-view-item-menu' });

    const handleMenuItemClick = (action: TodoItemAction<any>) => () => {
        popupState.close();
        const ret = action.onAction(props.todoItem);
        if (ret?.closePopup) {
            window.close();
        }
        if (ret?.refreshList) {
            props.onRefreshListRequest();
        }
        if (ret?.showSnackbar) {
            props.handleShowSnackbar(ret.showSnackbar.message, ret.showSnackbar.severity);
        }
    };

    return (
        <Paper className={classes.root}>
            <div className={classes.icon}>
                <props.todoItem.Icon item={props.todoItem} />
            </div>
            <Grid
                container
                justifyContent="center"
                alignItems="flex-start"
                direction="column"
                className={classes.titleCategoryTimeContainer}
            >
                <Grid container className={classes.titleCategoryTimeContainer}>
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        component="a"
                        className={classes.titleCategory}
                        href={props.todoItem.categoryHref}
                        onClick={handleLinkClick}
                        title={props.todoItem.category}
                    >
                        {props.todoItem.category}
                    </Typography>
                    <Grid item className={classes.spacer} />
                    <Typography variant="caption" color="textSecondary" className={classes.time}>
                        {props.todoItem.dueDate && formatTime(props.todoItem.dueDate)}
                    </Typography>
                </Grid>
                <Typography
                    variant="body2"
                    color="textPrimary"
                    component="a"
                    className={classes.titleCategory}
                    href={props.todoItem.titleHref}
                    onClick={handleLinkClick}
                    title={props.todoItem.title}
                >
                    {props.todoItem.title}
                </Typography>
            </Grid>
            <Center>
                {props.todoItem.actions.length > 0 && (
                    <IconButton size="small" {...bindTrigger(popupState)}>
                        <MoreVertIcon />
                    </IconButton>
                )}
            </Center>

            <Menu {...bindMenu(popupState)}>
                {props.todoItem.actions.map((action, i) => [
                    <MenuItem key={i} onClick={handleMenuItemClick(action)} dense>
                        <ListItemIcon className={classes.listItemIconRoot}>
                            {action.Icon && <action.Icon item={props.todoItem} action={action} />}
                        </ListItemIcon>
                        {action.title}
                    </MenuItem>,
                    action.divider && <Divider />,
                ])}
            </Menu>
        </Paper>
    );
});

function formatTime(date: Date): string {
    return date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
}
