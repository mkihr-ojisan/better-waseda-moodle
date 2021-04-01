import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { ReactElement, useContext, useState } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import { registerCourseData } from '../../../common/waseda/course/course-data';
import { CourseOverviewContext } from '../CourseOverview';

type Props = {
    open: boolean;
    onClose?: () => void;
    course: CourseListItem;
};

export default function ChangeNameDialog(props: Props): ReactElement {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            {props.open && <ChangeNameDialogContent {...props} />}
        </Dialog>
    );
}

function ChangeNameDialogContent(props: Props): ReactElement {
    const context = useContext(CourseOverviewContext);

    const [name, setName] = useState(() => context.courseData[props.course.id]?.overrideName ?? props.course.name);

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    function handleOK() {
        if (name === props.course.name) {
            registerCourseData(props.course.id, 'overrideName', undefined);
        } else {
            registerCourseData(props.course.id, 'overrideName', name);
        }

        props.onClose?.();
    }
    function handleSetToDefault() {
        setName(props.course.name);
    }

    return (
        <>
            <DialogTitle>{browser.i18n.getMessage('courseOverviewChangeNameDialogTitle')}</DialogTitle>
            <DialogContent>
                <TextField
                    value={name}
                    onChange={handleOnChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSetToDefault} color="primary">
                    {browser.i18n.getMessage('courseOverviewChangeNamesDialogSetToDefault')}
                </Button>
                <Button onClick={props.onClose} color="primary">
                    {browser.i18n.getMessage('cancel')}
                </Button>
                <Button onClick={handleOK} color="primary">
                    {browser.i18n.getMessage('courseOverviewChangeNamesDialogOK')}
                </Button>
            </DialogActions>
        </>
    );
}