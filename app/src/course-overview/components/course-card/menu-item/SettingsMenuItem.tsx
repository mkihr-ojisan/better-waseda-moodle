import React, { ReactElement, useState } from 'react';
import { CourseListItem } from '../../../../common/waseda/course/course';
import CourseMenuItem from './CourseMenuItem';
import Settings from '@material-ui/icons/Settings';
import CourseSettingsDialog from '../../dialog/CourseSettingsDialog';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default function SettingsMenuItem(props: Props): ReactElement {
    const [dialogOpen, setDialogOpen] = useState(false);

    function handleClick() {
        setDialogOpen(true);
    }

    return (
        <>
            <CourseMenuItem icon={<Settings />} onClick={handleClick} onCloseMenu={props.onCloseMenu}>
                {browser.i18n.getMessage('courseOverviewSettings')}
            </CourseMenuItem>
            <CourseSettingsDialog course={props.course} open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
}