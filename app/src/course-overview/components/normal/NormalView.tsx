import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React, { ReactElement, useContext, useState } from 'react';
import { useCallback } from 'react';
import CourseListView from '../CourseListView';
import { CourseOverviewContext } from '../CourseOverview';
import HiddenCoursesDialog from '../dialog/HiddenCoursesDialog';

export default React.memo(function NormalView(): ReactElement {
    const context = useContext(CourseOverviewContext);

    const [hiddenCoursesDialogOpen, setHiddenCoursesDialogOpen] = useState(false);
    const handleOpenHiddenCoursesDialog = useCallback(() => {
        setHiddenCoursesDialogOpen(true);
    }, []);
    const handleCloseHiddenCoursesDialog = useCallback(() => {
        setHiddenCoursesDialogOpen(false);
    }, []);

    return (
        <>
            <Grid container>
                <Grid item>
                    <Button variant="outlined" onClick={handleOpenHiddenCoursesDialog}>
                        {browser.i18n.getMessage('courseOverviewHiddenCourses')}
                    </Button>
                    <HiddenCoursesDialog open={hiddenCoursesDialogOpen} onClose={handleCloseHiddenCoursesDialog} />
                </Grid>
            </Grid>
            <CourseListView courses={context.courseList.filter((c) => !c.isHidden)} />
        </>
    );
});
