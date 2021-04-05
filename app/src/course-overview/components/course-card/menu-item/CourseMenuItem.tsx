import { makeStyles } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import React, { ReactElement, ReactNode } from 'react';

type Props = {
    icon: ReactNode;
    onClick: () => void;
    onCloseMenu: () => void;
    children: ReactNode;
};

const useStyles = makeStyles(() => ({
    listItemIconRoot: {
        minWidth: 40,
    },
}));

export default function CourseMenuItem(props: Props): ReactElement {
    const classes = useStyles();

    function handleClick() {
        props.onClick();
        props.onCloseMenu();
    }

    return (
        <MenuItem onClick={handleClick}>
            <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                {props.icon}
            </ListItemIcon>
            {props.children}
        </MenuItem>
    );
}