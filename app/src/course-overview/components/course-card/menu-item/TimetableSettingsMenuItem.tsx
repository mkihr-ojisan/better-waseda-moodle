import CalendarToday from '@material-ui/icons/CalendarToday';
import React, { ReactElement, useState, Ref, useCallback } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import TimetableSettingsDialog from '../../dialog/TimetableSettingsDialog';
import CourseMenuItem from './CourseMenuItem';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default React.memo(
    React.forwardRef(function TimetableSettingsMenuItem(props: Props, ref: Ref<any>): ReactElement {
        const [dialogOpen, setDialogOpen] = useState(false);

        const handleClick = useCallback(() => {
            setDialogOpen(true);
        }, []);
        const handleClose = useCallback(() => setDialogOpen(false), []);

        return (
            <>
                <CourseMenuItem
                    icon={<CalendarToday />}
                    onClick={handleClick}
                    onCloseMenu={props.onCloseMenu}
                    ref={ref}
                >
                    {browser.i18n.getMessage('courseOverviewTimetableSettings')}
                </CourseMenuItem>
                <TimetableSettingsDialog course={props.course} open={dialogOpen} onClose={handleClose} />
            </>
        );
    })
);
