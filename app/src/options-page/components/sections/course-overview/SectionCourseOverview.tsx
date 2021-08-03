import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import React, { ReactElement, useState } from 'react';
import { useCallback } from 'react';
import AutoCloseAlert from '../../../../common/react/AutoCloseAlert';
import useConfig from '../../../../common/react/useConfig';
import { MessengerClient } from '../../../../common/util/messenger';
import { CourseListItem } from '../../../../common/waseda/course/course';
import { registerCourseData } from '../../../../common/waseda/course/course-data';
import { CourseRegistrationInfo } from '../../../../common/waseda/course/course-registration';
import { SectionComponentProps } from '../../Options';
import Section from '../../Section';
import OptionShowPeriodTime from './OptionShowPeriodTime';

export default React.memo(function SectionCourseOverview(props: SectionComponentProps): ReactElement | null {
    const [enabled, setEnabled] = useConfig('courseOverview.enabled');
    const [type, setType] = useConfig('courseOverview.type');

    const [courseCacheClearedSnackbarOpen, setCourseCacheClearedSnackbarOpen] = useState(false);
    const [fetchTimetableDataAndSyllabusUrlMessageOpen, setFetchTimetableDataAndSyllabusUrlMessageOpen] =
        useState(false);
    const [fetchTimetableDataAndSyllabusUrlDoneMessageOpen, setFetchTimetableDataAndSyllabusUrlDoneMessageOpen] =
        useState(false);
    const [fetchTimetableDataAndSyllabusUrlError, setFetchTimetableDataAndSyllabusError] = useState<Error | null>(null);
    const [isFetchingTimetableDataAndSyllabusUrl, setIsFetchingTimetableDataAndSyllabusUrl] = useState(false);

    function handleSwitchChange(setStateFunc: (value: boolean) => void) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setStateFunc(event.target.checked);
        };
    }
    function handleSelectChange<T extends string>(setStateFunc: (value: T) => void) {
        return (event: React.ChangeEvent<{ value: unknown }>) => {
            setStateFunc(event.target.value as T);
        };
    }

    const handleClearCourseCache = useCallback(() => {
        MessengerClient.exec('clearCourseListCache').then(() => {
            setCourseCacheClearedSnackbarOpen(true);
        });
    }, []);
    const handleFetchTimetableDataAndSyllabusUrl = useCallback(() => {
        setIsFetchingTimetableDataAndSyllabusUrl(true);
        fetchTimetableDataAndSyllabusUrl()
            .then(() => {
                setFetchTimetableDataAndSyllabusError(null);
            })
            .catch((error) => {
                setFetchTimetableDataAndSyllabusError(error);
            })
            .finally(() => {
                setFetchTimetableDataAndSyllabusUrlDoneMessageOpen(true);
                setIsFetchingTimetableDataAndSyllabusUrl(false);
                setFetchTimetableDataAndSyllabusUrlMessageOpen(false);
            });
    }, []);
    const handleFetchTimetableDataNadSyllabusUrlClick = useCallback(
        () => setFetchTimetableDataAndSyllabusUrlMessageOpen(true),
        []
    );
    const handleClearCourseListCacheMessageClose = useCallback(() => setCourseCacheClearedSnackbarOpen(false), []);
    const handleFetchTimetableDataAndSyllabusUrlMessageClose = useCallback(
        () => setFetchTimetableDataAndSyllabusUrlMessageOpen(false),
        []
    );
    const handleFetchTimetableDataAndSyllabusUrlDoneMessageClose = useCallback(
        () => setFetchTimetableDataAndSyllabusUrlDoneMessageOpen(false),
        []
    );

    if (enabled === undefined || type === undefined) return null;

    return (
        <Section titleMessageName="optionsSectionCourseOverview" {...props}>
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={enabled} onChange={handleSwitchChange(setEnabled)} />}
                    label={browser.i18n.getMessage('optionsEnableCourseOverview')}
                />
                <TextField
                    value={type}
                    select
                    onChange={handleSelectChange(setType)}
                    label={browser.i18n.getMessage('optionsCourseOverviewTypeLabel')}
                    disabled={!enabled}
                >
                    <MenuItem value="normal">{browser.i18n.getMessage('optionsCourseOverviewTypeNormal')}</MenuItem>
                    <MenuItem value="timetable">
                        {browser.i18n.getMessage('optionsCourseOverviewTypeTimetable')}
                    </MenuItem>
                </TextField>
                <OptionShowPeriodTime />
            </FormGroup>

            <Box my={1}>
                <Grid container spacing={1}>
                    <Grid item>
                        <Button variant="outlined" onClick={handleClearCourseCache}>
                            {browser.i18n.getMessage('optionsClearCourseListCache')}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={handleFetchTimetableDataNadSyllabusUrlClick}>
                            {browser.i18n.getMessage('optionsFetchTimetableDataAndSyllabusUrl')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <AutoCloseAlert
                severity="success"
                open={courseCacheClearedSnackbarOpen}
                onClose={handleClearCourseListCacheMessageClose}
            >
                {browser.i18n.getMessage('optionsClearCourseListCacheMessage')}
            </AutoCloseAlert>

            <Dialog
                open={fetchTimetableDataAndSyllabusUrlMessageOpen}
                onClose={handleFetchTimetableDataAndSyllabusUrlMessageClose}
            >
                <DialogContent>
                    <DialogContentText>
                        {browser.i18n.getMessage('optionsFetchTimetableDataAndSyllabusUrlMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isFetchingTimetableDataAndSyllabusUrl && <CircularProgress />}
                    <Button
                        color="primary"
                        disabled={isFetchingTimetableDataAndSyllabusUrl}
                        onClick={handleFetchTimetableDataAndSyllabusUrlMessageClose}
                    >
                        {browser.i18n.getMessage('cancel')}
                    </Button>
                    <Button
                        color="primary"
                        disabled={isFetchingTimetableDataAndSyllabusUrl}
                        onClick={handleFetchTimetableDataAndSyllabusUrl}
                    >
                        {browser.i18n.getMessage('optionsFetchTimetableDataAndSyllabusUrlMessageOK')}
                    </Button>
                </DialogActions>
            </Dialog>
            <AutoCloseAlert
                severity={fetchTimetableDataAndSyllabusUrlError ? 'error' : 'success'}
                open={fetchTimetableDataAndSyllabusUrlDoneMessageOpen}
                onClose={handleFetchTimetableDataAndSyllabusUrlDoneMessageClose}
            >
                {fetchTimetableDataAndSyllabusUrlError?.message ??
                    browser.i18n.getMessage('optionsFetchTimetableDataAndSyllabusUrlDoneMessage')}
            </AutoCloseAlert>
        </Section>
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
            }))
        );
        await registerCourseData(course.id, 'syllabusUrl', info.syllabusUrl);
    }
}
