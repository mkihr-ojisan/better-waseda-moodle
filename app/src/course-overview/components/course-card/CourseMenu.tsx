import Menu from '@mui/material/Menu';
import React, { ReactElement } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import HideCourseMenuItem from './menu-item/HideCourseMenuItem';
import TimetableSettingsMenuItem from './menu-item/TimetableSettingsMenuItem';
import UnhideCourseMenuItem from './menu-item/UnhideCourseMenuItem';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import { PopoverPosition, PopoverReference } from '@mui/material/Popover';
import SettingsMenuItem from './menu-item/SettingsMenuItem';
import OpenSyllabusMenuItem from './menu-item/OpenSyllabusMenuItem';
import AssignmentListMenuItem from './menu-item/AssignmentListMenuItem';

type Props = {
    course: CourseListItem;
    anchorEl?: Element | null;
    open: boolean;
    onClose: () => void;
    anchorPosition?: PopoverPosition;
    anchorReference?: PopoverReference;
};

const useStyles = makeStyles((theme) => ({
    menuDivider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export default React.memo(function CourseMenu(props: Props): ReactElement {
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
            <OpenSyllabusMenuItem course={props.course} onCloseMenu={props.onClose} />
            <AssignmentListMenuItem course={props.course} onCloseMenu={props.onClose} />
            <Divider classes={{ root: classes.menuDivider }} />
            {props.course.isHidden ? (
                <UnhideCourseMenuItem course={props.course} onCloseMenu={props.onClose} />
            ) : (
                <HideCourseMenuItem course={props.course} onCloseMenu={props.onClose} />
            )}
            <TimetableSettingsMenuItem course={props.course} onCloseMenu={props.onClose} />
            <SettingsMenuItem course={props.course} onCloseMenu={props.onClose} />
        </Menu>
    );
});
