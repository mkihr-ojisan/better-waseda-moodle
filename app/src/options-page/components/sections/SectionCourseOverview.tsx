import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import React, { ReactElement, useState } from 'react';
import useConfig from '../../../common/react/useConfig';
import { clearCourseListCache } from '../../../common/waseda/course/course-list';
import { SectionComponentProps } from '../Options';
import Section from '../Section';

export default function SectionCourseOverview(props: SectionComponentProps): ReactElement | null {
    const [enabled, setEnabled] = useConfig('courseOverview.enabled');
    const [type, setType] = useConfig('courseOverview.type');

    const [courseCacheClearedSnackbarOpen, setCourseCacheClearedSnackbarOpen] = useState(false);

    if (enabled === undefined || type === undefined) return null;

    function handleSwitchChange(setStateFunc: (value: boolean) => void) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setStateFunc(event.target.checked);
        };
    }
    function handleSelectChange<T extends string>(setStateFunc: (value: T) => void) {
        return (event: React.ChangeEvent<{ value: unknown; }>) => {
            setStateFunc(event.target.value as T);
        };
    }

    function handleClearCourseCache() {
        clearCourseListCache().then(() => {
            setCourseCacheClearedSnackbarOpen(true);
        });
    }

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
                    <MenuItem value="timetable">{browser.i18n.getMessage('optionsCourseOverviewTypeTimetable')}</MenuItem>
                </TextField>
            </FormGroup>

            <Box my={1}>
                <Grid container spacing={1} >
                    <Grid item>
                        <Button variant="outlined" onClick={handleClearCourseCache}>
                            {browser.i18n.getMessage('optionsClearCourseListCache')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Snackbar
                open={courseCacheClearedSnackbarOpen}
                autoHideDuration={1500}
                onClose={() => setCourseCacheClearedSnackbarOpen(false)}
            >
                <Alert severity="success">
                    {browser.i18n.getMessage('optionsClearCourseListCacheMessage')}
                </Alert>
            </Snackbar>
        </Section>
    );
}