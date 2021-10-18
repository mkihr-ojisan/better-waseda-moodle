import React, { ReactElement, useContext, useState, Ref } from 'react';
import CourseMenuItem from './CourseMenuItem';
import LaunchIcon from '@mui/icons-material/Launch';
import CourseSettingsDialog from '../../dialog/CourseSettingsDialog';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { CourseOverviewContext } from '../../CourseOverview';
import { useCallback } from 'react';

type Props = {
    course: CourseListItem;
    onCloseMenu: () => void;
};

export default React.memo(
    React.forwardRef(function OpenSyllabusMenuItem(props: Props, ref: Ref<any>): ReactElement {
        const context = useContext(CourseOverviewContext);
        const [dialogOpen, setDialogOpen] = useState(false);
        const [settingsOpen, setSettingsOpen] = useState(false);

        const handleClick = useCallback(() => {
            const syllabusUrl = context.courseData[props.course.id]?.syllabusUrl;
            if (syllabusUrl) {
                window.open(syllabusUrl, '_blank');
            } else {
                setDialogOpen(true);
            }
        }, [context.courseData, props.course.id]);

        const handleCancel = useCallback(() => {
            setDialogOpen(false);
        }, []);
        const handleOpenSettings = useCallback(() => {
            setDialogOpen(false);
            setSettingsOpen(true);
        }, []);

        const handleClose = useCallback(() => setDialogOpen(false), []);

        return (
            <>
                <CourseMenuItem icon={<LaunchIcon />} onClick={handleClick} onCloseMenu={props.onCloseMenu} ref={ref}>
                    {browser.i18n.getMessage('courseOverviewOpenSyllabus')}
                </CourseMenuItem>
                <Dialog open={dialogOpen} onClose={handleClose}>
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
                <CourseSettingsDialog course={props.course} open={settingsOpen} onClose={handleClose} />
            </>
        );
    })
);
