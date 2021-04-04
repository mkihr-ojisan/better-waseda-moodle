import Edit from '@material-ui/icons/Edit';
import React, { ReactElement, useState } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import ChangeNameDialog from '../../dialog/ChangeNameDialog';
import CourseMenuItem from './CourseMenuItem';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default function ChangeNameMenuItem(props: Props): ReactElement {
    const [dialogOpen, setDialogOpen] = useState(false);

    function handleClick() {
        setDialogOpen(true);
    }

    return (
        <>
            <CourseMenuItem icon={<Edit />} onClick={handleClick} onCloseMenu={props.onCloseMenu}>
                {browser.i18n.getMessage('courseOverviewChangeName')}
            </CourseMenuItem>
            <ChangeNameDialog course={props.course} open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
}