import CalendarToday from '@material-ui/icons/CalendarToday';
import React, { ReactElement, useState } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import TimetableSettingsDialog from '../../dialog/TimetableSettingsDialog';
import CourseMenuItem from './CourseMenuItem';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default function TimetableSettingsMenuItem(props: Props): ReactElement {
    const [dialogOpen, setDialogOpen] = useState(false);

    function handleClick() {
        setDialogOpen(true);
    }

    return (
        <>
            <CourseMenuItem icon={<CalendarToday />} onClick={handleClick} onCloseMenu={props.onCloseMenu}>
                {browser.i18n.getMessage('courseOverviewTimetableSettings')}
            </CourseMenuItem>
            <TimetableSettingsDialog course={props.course} open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
}