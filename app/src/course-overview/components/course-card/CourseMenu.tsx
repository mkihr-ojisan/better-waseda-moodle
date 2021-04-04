import Menu from '@material-ui/core/Menu';
import React, { ReactElement } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import HideCourseMenuItem from './menu-item/HideCourseMenuItem';
import TimetableSettingsMenuItem from './menu-item/TimetableSettingsMenuItem';
import UnhideCourseMenuItem from './menu-item/UnhideCourseMenuItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { PopoverPosition, PopoverReference } from '@material-ui/core/Popover';
import SettingsMenuItem from './menu-item/SettingsMenuItem';

type Props = {
    course: CourseListItem;
    anchorEl?: Element | null;
    open: boolean;
    onClose: () => void;
    anchorPosition?: PopoverPosition;
    anchorReference?: PopoverReference;
};

const useStyles = makeStyles(theme => ({
    menuDivider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export default function CourseMenu(props: Props): ReactElement {
    const classes = useStyles();

    return (
        <Menu
            anchorEl={props.anchorEl}
            keepMounted
            open={props.open}
            onClose={props.onClose}
            anchorPosition={props.anchorPosition}
            anchorReference={props.anchorReference}
        >
            {
                props.course.isHidden
                    ? <UnhideCourseMenuItem course={props.course} onCloseMenu={props.onClose} />
                    : <HideCourseMenuItem course={props.course} onCloseMenu={props.onClose} />
            }
            <TimetableSettingsMenuItem course={props.course} onCloseMenu={props.onClose} />
            <SettingsMenuItem course={props.course} onCloseMenu={props.onClose} />
        </Menu>
    );
}