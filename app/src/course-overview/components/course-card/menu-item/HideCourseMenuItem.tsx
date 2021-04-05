import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { ReactElement, useContext } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { CourseOverviewContext } from '../../CourseOverview';
import CourseMenuItem from './CourseMenuItem';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default function HideCourseMenuItem(props: Props): ReactElement {
    const context = useContext(CourseOverviewContext);

    function handleClick() {
        context.hideCourse(props.course);
    }

    return (
        <CourseMenuItem icon={<VisibilityOff />} onClick={handleClick} onCloseMenu={props.onCloseMenu}>
            {browser.i18n.getMessage('courseOverviewHide')}
        </CourseMenuItem>
    );
}