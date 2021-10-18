import React, { ReactElement, useState, Ref } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import CourseMenuItem from './CourseMenuItem';
import Settings from '@mui/icons-material/Settings';
import CourseSettingsDialog from '../../dialog/CourseSettingsDialog';
import { useCallback } from 'react';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default React.memo(
    React.forwardRef(function SettingsMenuItem(props: Props, ref: Ref<any>): ReactElement {
        const [dialogOpen, setDialogOpen] = useState(false);

        const handleClick = useCallback(() => {
            setDialogOpen(true);
        }, []);
        const handleClose = useCallback(() => setDialogOpen(false), []);

        return (
            <>
                <CourseMenuItem icon={<Settings />} onClick={handleClick} onCloseMenu={props.onCloseMenu} ref={ref}>
                    {browser.i18n.getMessage('courseOverviewSettings')}
                </CourseMenuItem>
                <CourseSettingsDialog course={props.course} open={dialogOpen} onClose={handleClose} />
            </>
        );
    })
);
