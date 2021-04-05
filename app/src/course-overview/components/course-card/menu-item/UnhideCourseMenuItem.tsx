import Visibility from '@material-ui/icons/Visibility';
import React, { ReactElement, useContext } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { CourseOverviewContext } from '../../CourseOverview';
import CourseMenuItem from './CourseMenuItem';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default function UnhideCourseMenuItem(props: Props): ReactElement {
    const context = useContext(CourseOverviewContext);

    function handleClick() {
        context.unhideCourse(props.course);
    }

    return (
        <CourseMenuItem icon={<Visibility />} onClick={handleClick} onCloseMenu={props.onCloseMenu}>
            {browser.i18n.getMessage('courseOverviewUnhide')}
        </CourseMenuItem>
    );
}