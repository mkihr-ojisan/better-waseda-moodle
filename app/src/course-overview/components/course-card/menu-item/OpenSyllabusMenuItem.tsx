import React, { ReactElement, useContext, useState, Ref } from 'react';
import CourseMenuItem from './CourseMenuItem';
import LaunchIcon from '@material-ui/icons/Launch';
import CourseSettingsDialog from '../../dialog/CourseSettingsDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { CourseOverviewContext } from '../../CourseOverview';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default React.forwardRef(function OpenSyllabusMenuItem(props: Props, ref: Ref<any>): ReactElement {
    const context = useContext(CourseOverviewContext);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    function handleClick() {
        const syllabusUrl = context.courseData[props.course.id]?.syllabusUrl;
        if (syllabusUrl) {
            window.open(syllabusUrl, '_blank');
        } else {
            setDialogOpen(true);
        }
    }

    function handleCancel() {
        setDialogOpen(false);
    }
    function handleOpenSettings() {
        setDialogOpen(false);
        setSettingsOpen(true);
    }

    return (
        <>
            <CourseMenuItem icon={<LaunchIcon />} onClick={handleClick} onCloseMenu={props.onCloseMenu} ref={ref}>
                {browser.i18n.getMessage('courseOverviewOpenSyllabus')}
            </CourseMenuItem>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent>
                    <DialogContentText>
                        {browser.i18n.getMessage('courseOverviewSyllabusUrlNotSetDialogMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleCancel}>
                        {browser.i18n.getMessage('cancel')}
                    </Button>
                    <Button color="primary" onClick={handleOpenSettings}>
                        {browser.i18n.getMessage('courseOverviewSyllabusUrlNotSetDialogOpenSettings')}
                    </Button>
                </DialogActions>
            </Dialog>
            <CourseSettingsDialog course={props.course} open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
});