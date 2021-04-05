import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, { ReactElement, useContext, useState } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import { registerCourseData } from '../../../common/waseda/course/course-data';
import { CourseOverviewContext } from '../CourseOverview';

type Props = {
    course: CourseListItem;
    open: boolean;
    onClose: () => void;
};

export default function CourseSettingsDialog(props: Props): ReactElement {
    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm" disableBackdropClick>
            {props.open && <CourseSettingsDialogContent {...props} />}
        </Dialog>
    );
}

function CourseSettingsDialogContent(props: Props) {
    const context = useContext(CourseOverviewContext);
    const courseData = context.courseData[props.course.id];
    const [name, setName] = useState(courseData?.overrideName ?? props.course.name);
    const [syllabusUrl, setSyllabusUrl] = useState(courseData?.syllabusUrl ?? '');
    const [note, setNote] = useState(courseData?.note ?? '');

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }
    function handleSetNameToDefault() {
        setName(props.course.name);
    }
    function handleSyllabusUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSyllabusUrl(event.target.value);
    }
    function handleNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNote(event.target.value);
    }

    function handleCancel() {
        props.onClose();
    }
    async function handleOK() {
        await registerCourseData(props.course.id, 'overrideName', name === props.course.name ? undefined : name);
        await registerCourseData(props.course.id, 'syllabusUrl', syllabusUrl === '' ? undefined : syllabusUrl);
        await registerCourseData(props.course.id, 'note', note === '' ? undefined : note);
        props.onClose();
    }

    return (
        <>
            <DialogTitle>{browser.i18n.getMessage('courseOverviewSettingsDialogTitle', props.course.name)}</DialogTitle>
            <DialogContent>
                <Grid container direction="column" spacing={1}>
                    <Grid item>
                        <Grid container alignItems="flex-end" spacing={1}>
                            <Grid item xs>
                                <TextField
                                    value={name}
                                    onChange={handleNameChange}
                                    fullWidth
                                    label={browser.i18n.getMessage('courseOverviewSettingsDialogName')}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={handleSetNameToDefault}
                                >
                                    {browser.i18n.getMessage('courseOverviewSettingsDialogSetNameToDefault')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <TextField
                            value={syllabusUrl}
                            onChange={handleSyllabusUrlChange}
                            fullWidth
                            label={browser.i18n.getMessage('courseOverviewSettingsDialogSyllabusUrl')}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="outlined"
                            value={note}
                            onChange={handleNoteChange}
                            fullWidth
                            multiline
                            rows={4}
                            label={browser.i18n.getMessage('courseOverviewSettingsDialogNote')}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    {browser.i18n.getMessage('cancel')}
                </Button>
                <Button onClick={handleOK} color="primary">
                    {browser.i18n.getMessage('courseOverviewSettingsDialogOK')}
                </Button>
            </DialogActions>
        </>
    );
}