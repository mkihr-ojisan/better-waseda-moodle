import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect, useState } from 'react';
import BWMThemePrefersColorScheme from '../../../react/theme/BWMThemePrefersColorScheme';
import { usePromise } from '../../../react/usePromise';
import { MessengerClient } from '../../../util/messenger';
import { CourseListItem } from '../../../waseda/course/course';
import { OpenAddToDoItemPageOptions } from '../../todo';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { addOrUpdateToDoItem } from '../../user-added-items';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(() => ({
    fill: {
        width: '100%',
        height: '100%',
    },
    spacer: {
        flexGrow: 1,
    },
}));

export default React.memo(function AddToDoItemPage(props: OpenAddToDoItemPageOptions) {
    const classes = useStyles();

    const [modified, setModified] = useState(false);

    const [iconUrl, setIconUrl] = useState(props.defaultIconUrl ?? '');
    const [category, setCategory] = useState(props.defaultCategory ?? '');
    const [title, setTitle] = useState(props.defaultTitle ?? '');
    const [titleHref, setTitleHref] = useState(props.defaultTitle ?? '');
    //const [dueDate, setDueDate] = useState(props.defaultDueDate ? new Date(props.defaultDueDate) : new Date());

    const courseList = usePromise<CourseListItem[]>(() => MessengerClient.exec('fetchCourseList'), []);

    const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        setModified(true);
    }, []);
    const handleIconUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setIconUrl(event.target.value);
        setModified(true);
    }, []);
    const handleCategoryChange = useCallback((event: React.ChangeEvent<{}>, value: string) => {
        setCategory(value);
        setModified(true);
    }, []);
    const handleTitleHrefChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleHref(event.target.value);
        setModified(true);
    }, []);
    const handleButtonClick = useCallback(() => {
        addOrUpdateToDoItem({
            id: props.id ?? genId(),
            iconUrl: iconUrl === '' ? undefined : iconUrl,
            category: category === '' ? undefined : category,
            courseId: courseList?.find((course) => course.name === category)?.id ?? undefined,
            title,
            titleHref: titleHref === '' ? undefined : titleHref,
        });

        window.onbeforeunload = null; // beforeunloadのイベントリスナー内でpreventDefaultされないように

        window.close();
    }, [category, courseList, iconUrl, props.id, title, titleHref]);

    useEffect(() => {
        window.onbeforeunload = (e: Event) => {
            if (modified) {
                e.preventDefault();
            }
        };
        return () => {
            window.onbeforeunload = null;
        };
    }, [modified]);

    return (
        <BWMThemePrefersColorScheme>
            <CssBaseline />

            <Box p={1} className={classes.fill}>
                <Grid container spacing={2} direction="column" className={classes.fill} wrap="nowrap">
                    <Grid item>
                        <TextField
                            value={title}
                            label={browser.i18n.getMessage('addToDoItemTitle')}
                            onChange={handleTitleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            value={iconUrl}
                            label={browser.i18n.getMessage('addToDoItemIconUrl')}
                            onChange={handleIconUrlChange}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {iconUrl ? <img src={iconUrl} width="24" /> : <FiberManualRecordIcon />}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            freeSolo
                            options={courseList?.map((c) => c.name) ?? []}
                            disableClearable
                            value={category}
                            onInputChange={handleCategoryChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={browser.i18n.getMessage('addToDoItemCategory')}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            value={titleHref}
                            label={browser.i18n.getMessage('addToDoItemTitleHref')}
                            onChange={handleTitleHrefChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    {/* TODO: Add datetime picker */}
                    <Grid item className={classes.spacer} />
                    <Grid item>
                        <Grid container direction="row-reverse">
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={handleButtonClick}>
                                    {browser.i18n.getMessage('addToDoItemOK')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </BWMThemePrefersColorScheme>
    );
});

function genId() {
    return uuidv4();
}