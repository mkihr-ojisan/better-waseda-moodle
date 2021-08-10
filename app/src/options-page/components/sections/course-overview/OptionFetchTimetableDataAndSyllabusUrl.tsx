import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { MessengerClient } from '../../../../common/util/messenger';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { registerCourseData } from '../../../../common/waseda/course/course-data';
import { CourseRegistrationInfo } from '../../../../common/waseda/course/course-registration';
import Action from '../../options/Action';

export default React.memo(function OptionFetchTimetableDataAndSyllabusUrl() {
    const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleClick = useCallback(() => {
        setProcessingDialogOpen(true);
        fetchTimetableDataAndSyllabusUrl()
            .then(() => {
                setError(null);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setSnackBarOpen(true);
                setProcessingDialogOpen(false);
            });
    }, []);

    const handleCloseSnackBar = useCallback(() => {
        setSnackBarOpen(false);
    }, []);

    return (
        <>
            <Action
                message="optionsFetchTimetableDataAndSyllabusUrl"
                description="optionsFetchTimetableDataAndSyllabusUrlDescription"
                buttonMessage="optionsFetchTimetableDataAndSyllabusUrlButton"
                onClick={handleClick}
            />

            <Dialog open={processingDialogOpen}>
                <DialogContent>
                    <Grid container justifyContent="space-around" alignItems="center" spacing={2}>
                        <Grid item>
                            <CircularProgress />
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" color="textPrimary">
                                {browser.i18n.getMessage('optionsFetchTimetableDataAndSyllabusUrlProcessing')}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            <Snackbar open={snackBarOpen} onClose={handleCloseSnackBar} autoHideDuration={5000}>
                <Alert severity={error ? 'error' : 'success'} onClose={handleCloseSnackBar} variant="filled">
                    {error?.message ?? browser.i18n.getMessage('optionsFetchTimetableDataAndSyllabusUrlDoneMessage')}
                </Alert>
            </Snackbar>
        </>
    );
});

async function fetchTimetableDataAndSyllabusUrl(): Promise<void> {
    const [list, infos]: [CourseListItem[], CourseRegistrationInfo[]] = await Promise.all([
        MessengerClient.exec('fetchCourseList'),
        MessengerClient.exec('fetchCourseRegistrationInfo'),
    ]);

    for (const course of list) {
        const info = infos.find((i) => i.name === course.name && i.status === '決定');
        if (!info) continue;

        await registerCourseData(
            course.id,
            'timetableData',
            info.termDayPeriods.map((v) => ({
                yearTerm: { year: parseInt(course.category), term: v.term },
                dayPeriod: v.dayPeriod,
            })),
            true
        );
        await registerCourseData(course.id, 'syllabusUrl', info.syllabusUrl);
    }
}
