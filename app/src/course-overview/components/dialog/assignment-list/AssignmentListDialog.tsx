import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Close from '@material-ui/icons/Close';
import React, { ReactElement } from 'react';
import { useMemo } from 'react';
import { usePromise } from '../../../../common/react/usePromise';
import { fetchCourseContent } from '../../../../common/waseda/course/content/course-content';
import { CourseSection } from '../../../../common/waseda/course/content/course-section';
import { CourseModule } from '../../../../common/waseda/course/content/module/course-module';
import { CourseListItem } from '../../../../common/waseda/course/course';
import Assignment from './Assignment';
import pLimit from 'p-limit';
import CenteredCircularProgress from '../../../../common/react/CenteredCircularProgress';

type Props = {
    open: boolean;
    onClose: () => void;
    course: CourseListItem;
};
const useStyles = makeStyles((theme) => ({
    title: {
        paddingInlineEnd: '48px',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export default function AssignmentListDialog(props: Props): ReactElement | null {
    const limit = useMemo(() => pLimit(2), []);

    function handleClose() {
        limit.clearQueue();
        props.onClose();
    }

    return (
        <Dialog open={props.open} onClose={handleClose} maxWidth="md" fullWidth>
            {props.open && <AssignmentListDialogContent {...props} limit={limit} />}
        </Dialog>
    );
}

function AssignmentListDialogContent(props: Props & { limit: pLimit.Limit }): ReactElement {
    const classes = useStyles();

    const courseContent = usePromise(() => fetchCourseContent(props.course), [props.course]);
    const assignments: [CourseSection, CourseModule<'assign'>][] | undefined = useMemo(
        () =>
            courseContent?.sections?.flatMap((section) =>
                section.modules
                    .filter((module) => module.type === 'assign')
                    .map((module) => [section, module] as [CourseSection, CourseModule<'assign'>])
            ),
        [courseContent]
    );

    return (
        <>
            <DialogTitle classes={{ root: classes.title }}>
                {browser.i18n.getMessage('courseOverviewAssignmentDialogTitle', props.course.name)}
                <IconButton classes={{ root: classes.closeButton }} onClick={props.onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {assignments ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="50%"></TableCell>
                                <TableCell width="20%">
                                    {browser.i18n.getMessage('courseOverviewAssignmentDialogAssignmentStatus')}
                                </TableCell>
                                <TableCell width="15%">
                                    {browser.i18n.getMessage('courseOverviewAssignmentDialogGradingStatus')}
                                </TableCell>
                                <TableCell width="15%">
                                    {browser.i18n.getMessage('courseOverviewAssignmentDialogGrade')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignments.map(([section, module]) => (
                                <Assignment key={module.id} section={section} module={module} pLimit={props.limit} />
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <CenteredCircularProgress />
                )}
            </DialogContent>
        </>
    );
}
