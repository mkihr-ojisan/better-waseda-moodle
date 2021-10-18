import makeStyles from '@mui/styles/makeStyles';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import React, { ReactElement, ReactNode, Ref } from 'react';
import { useCallback } from 'react';

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

export default React.memo(
    React.forwardRef(function CourseMenuItem(props: Props, ref: Ref<any>): ReactElement {
        const classes = useStyles();

        const handleClick = useCallback(() => {
            props.onClick();
            props.onCloseMenu();
        }, [props]);

        return (
            <MenuItem onClick={handleClick} ref={ref}>
                <ListItemIcon classes={{ root: classes.listItemIconRoot }}>{props.icon}</ListItemIcon>
                {props.children}
            </MenuItem>
        );
    })
);
