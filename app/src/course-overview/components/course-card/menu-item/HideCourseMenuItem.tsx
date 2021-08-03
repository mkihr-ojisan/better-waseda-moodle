import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { ReactElement, useContext, Ref } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { CourseOverviewContext } from '../../CourseOverview';
import CourseMenuItem from './CourseMenuItem';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default React.memo(
    React.forwardRef(function HideCourseMenuItem(props: Props, ref: Ref<any>): ReactElement {
        const context = useContext(CourseOverviewContext);

        function handleClick() {
            context.hideCourse(props.course);
        }

        return (
            <CourseMenuItem icon={<VisibilityOff />} onClick={handleClick} onCloseMenu={props.onCloseMenu} ref={ref}>
                {browser.i18n.getMessage('courseOverviewHide')}
            </CourseMenuItem>
        );
    })
);
