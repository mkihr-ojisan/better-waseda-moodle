import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React, { ReactElement } from 'react';
import { usePromise } from '../../../../common/react/usePromise';
import { CourseSection } from '../../../../common/waseda/course/content/course-section';
import { fetchCourseModuleAssignContent } from '../../../../common/waseda/course/content/module/assign';
import { CourseModule } from '../../../../common/waseda/course/content/module/course-module';
import { LimitFunction } from 'p-limit';

type Props = {
    section: CourseSection;
    module: CourseModule<'assign'>;
    pLimit: LimitFunction;
};

export default React.memo(function Assignment(props: Props): ReactElement | null {
    const assignment = usePromise(
        () => props.pLimit(() => fetchCourseModuleAssignContent(props.module)),
        [props.module]
    );

    return (
        <TableRow>
            <TableCell>
                <a href={`https://wsdmoodle.waseda.jp/mod/assign/view.php?id=${props.module.id}`}>
                    {props.section.title}
                    <br />
                    {props.module.title}
                </a>
            </TableCell>
            <TableCell>
                {assignment ? assignment.submissionSummary.submissionStatus : <CircularProgress size="30px" />}
            </TableCell>
            <TableCell>{assignment ? assignment.submissionSummary.gradingStatus : null}</TableCell>
            <TableCell>{assignment ? assignment.feedback.grade : null}</TableCell>
        </TableRow>
    );
});
