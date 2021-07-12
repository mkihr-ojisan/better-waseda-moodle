import React, { ReactElement, Ref } from 'react';
import { useState } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import AssignmentListDialog from '../../dialog/assignment-list/AssignmentListDialog';
import CourseMenuItem from './CourseMenuItem';
import AssignmentIcon from '@material-ui/icons/Assignment';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default React.forwardRef(function AssignmentListMenuItem(props: Props, ref: Ref<any>): ReactElement {
    const [dialogOpen, setDialogOpen] = useState(false);

    function handleClick() {
        setDialogOpen(true);
    }

    return (
        <>
            <CourseMenuItem icon={<AssignmentIcon />} onClick={handleClick} onCloseMenu={props.onCloseMenu} ref={ref}>
                {browser.i18n.getMessage('courseOverviewAssignmentList')}
            </CourseMenuItem>
            <AssignmentListDialog open={dialogOpen} onClose={() => setDialogOpen(false)} course={props.course} />
        </>
    );
});
