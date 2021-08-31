import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import pLimit from 'p-limit';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { ConfigValue, getConfig, setConfig } from '../../../../common/config/config';
import { usePromise } from '../../../../common/react/usePromise';
import { MessengerClient } from '../../../../common/util/messenger';
import { ActionEvent } from '../../../../common/waseda/calendar';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import useConfig from '../../../../common/react/useConfig';
import { CourseListItem } from '../../../../common/waseda/course/course';
import Center from '../../../../common/react/Center';

export type HiddenToDoItemDialogProps = {
    open: boolean;
    onClose: () => void;
};

const useStyles = makeStyles((theme) => ({
    hidden: {
        display: 'none',
    },
    contentRoot: {
        padding: 0,
    },
    content: {
        flexGrow: 1,
        minHeight: 300,
    },
    empty: {
        position: 'absolute',
        height: 300,
    },
    itemRoot: {
        display: 'grid',
        gridTemplateColumns: '1fr 100px',
        width: '100%',
    },
    itemTitleContainer: {
        overflow: 'hidden',
        width: '100%',
        flexWrap: 'nowrap',
    },
    itemTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textDecoration: 'none',
        '&[href]:hover': {
            textDecoration: 'underline',
            color: theme.palette.primary.main,
        },
    },
}));

export default React.memo(function HiddenToDoItemDialog(props: HiddenToDoItemDialogProps) {
    return (
        <Dialog maxWidth="sm" fullWidth {...props}>
            {props.open && <HiddenToDoItemDialogContent />}
        </Dialog>
    );
});

function HiddenToDoItemDialogContent() {
    type Tab = 'ids' | 'courses' | 'modules';

    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState<Tab>('ids');

    const [hiddenItems] = useConfig('todo.hiddenItems');

    const handleSelectedTabChange = useCallback((_, newValue) => {
        setSelectedTab(newValue);
    }, []);

    return (
        <>
            <DialogTitle>{browser.i18n.getMessage('optionsHiddenToDoItemDialogTitle')}</DialogTitle>
            <DialogContent className={classes.contentRoot}>
                <Grid container direction="column">
                    <Grid item>
                        <Paper square>
                            <Tabs value={selectedTab} onChange={handleSelectedTabChange}>
                                <Tab value="ids" label={browser.i18n.getMessage('optionsHiddenToDoItemDialogIdsTab')} />
                                <Tab
                                    value="courses"
                                    label={browser.i18n.getMessage('optionsHiddenToDoItemDialogCoursesTab')}
                                />
                                <Tab
                                    value="modules"
                                    label={browser.i18n.getMessage('optionsHiddenToDoItemDialogModulesTab')}
                                />
                            </Tabs>
                        </Paper>
                    </Grid>
                    <Grid item className={classes.content}>
                        <HiddenIds selectedTab={selectedTab} hiddenItems={hiddenItems} />
                        <HiddenCourses selectedTab={selectedTab} hiddenItems={hiddenItems} />
                        <HiddenModules selectedTab={selectedTab} hiddenItems={hiddenItems} />
                    </Grid>
                </Grid>
            </DialogContent>
        </>
    );
}

type Props = {
    selectedTab: string;
    hiddenItems: ConfigValue<'todo.hiddenItems'>;
};

const limit = pLimit(1);
function HiddenIds(props: Props) {
    const classes = useStyles();

    return props.hiddenItems.courses.length > 0 ? (
        <List className={clsx(props.selectedTab !== 'ids' && classes.hidden)}>
            {props.hiddenItems.ids.map((id) => (
                <ListItem key={id}>
                    <HiddenId id={id} />
                </ListItem>
            ))}
        </List>
    ) : (
        <Center className={clsx(props.selectedTab !== 'ids' && classes.hidden, classes.empty)}>
            <Typography variant="body1" color="textSecondary">
                {browser.i18n.getMessage('optionsHiddenToDoItemDialogIdsEmpty')}
            </Typography>
        </Center>
    );
}
function HiddenId(props: { id: number }) {
    const classes = useStyles();
    const event = usePromise(
        async () =>
            limit(() => MessengerClient.exec('fetchCalendarEventById', props.id.toString()) as Promise<ActionEvent>),
        []
    );

    const handleClick = useCallback(() => {
        const oldValue = getConfig('todo.hiddenItems');
        const newValue = {
            ...oldValue,
            ids: oldValue.ids.filter((id) => id !== props.id),
        };
        setConfig('todo.hiddenItems', newValue);
    }, [props.id]);

    return (
        <div className={classes.itemRoot}>
            <Grid container alignItems="center" className={classes.itemTitleContainer}>
                {event ? (
                    <Typography
                        variant="body1"
                        component="a"
                        color="textPrimary"
                        href={event.url}
                        target="_blank"
                        className={classes.itemTitle}
                    >
                        {event.name}
                    </Typography>
                ) : (
                    <CircularProgress size="1.5em" />
                )}
            </Grid>
            <Button variant="outlined" onClick={handleClick}>
                {browser.i18n.getMessage('optionsHiddenToDoItemDialogUnhide')}
            </Button>
        </div>
    );
}

function HiddenCourses(props: Props) {
    const classes = useStyles();
    const courses = usePromise(
        () => limit(() => MessengerClient.exec('fetchCourseList') as Promise<CourseListItem[]>),
        []
    );

    const handleClick = (idToUnhide: number) => {
        const oldValue = getConfig('todo.hiddenItems');
        const newValue = {
            ...oldValue,
            courses: oldValue.courses.filter((id) => id !== idToUnhide),
        };
        setConfig('todo.hiddenItems', newValue);
    };

    return props.hiddenItems.courses.length > 0 ? (
        <List className={clsx(props.selectedTab !== 'courses' && classes.hidden)}>
            {props.hiddenItems.courses.map((id) => {
                const course = courses?.find((course) => course.id === id);
                return (
                    <ListItem key={id}>
                        <div className={classes.itemRoot}>
                            <Grid container alignItems="center" className={classes.itemTitleContainer}>
                                {course ? (
                                    <Typography
                                        variant="body1"
                                        component="a"
                                        color="textPrimary"
                                        href={`https://wsdmoodle.waseda.jp/course/view.php?id=${id}`}
                                        target="_blank"
                                        className={classes.itemTitle}
                                    >
                                        {course.name}
                                    </Typography>
                                ) : (
                                    <CircularProgress size="1.5em" />
                                )}
                            </Grid>
                            <Button variant="outlined" onClick={() => handleClick(id)}>
                                {browser.i18n.getMessage('optionsHiddenToDoItemDialogUnhide')}
                            </Button>
                        </div>
                    </ListItem>
                );
            })}
        </List>
    ) : (
        <Center className={clsx(props.selectedTab !== 'courses' && classes.hidden, classes.empty)}>
            <Typography variant="body1" color="textSecondary">
                {browser.i18n.getMessage('optionsHiddenToDoItemDialogCoursesEmpty')}
            </Typography>
        </Center>
    );
}

function HiddenModules(props: Props) {
    const classes = useStyles();

    const handleClick = (moduleToUnhide: string) => {
        const oldValue = getConfig('todo.hiddenItems');
        const newValue = {
            ...oldValue,
            modules: oldValue.modules.filter((module) => module !== moduleToUnhide),
        };
        setConfig('todo.hiddenItems', newValue);
    };

    return props.hiddenItems.courses.length > 0 ? (
        <List className={clsx(props.selectedTab !== 'modules' && classes.hidden)}>
            {props.hiddenItems.modules.map((module) => (
                <ListItem key={module}>
                    <div className={classes.itemRoot}>
                        <Grid container alignItems="center" className={classes.itemTitleContainer}>
                            <Typography variant="body1" color="textPrimary" className={classes.itemTitle}>
                                {module}
                            </Typography>
                        </Grid>
                        <Button variant="outlined" onClick={() => handleClick(module)}>
                            {browser.i18n.getMessage('optionsHiddenToDoItemDialogUnhide')}
                        </Button>
                    </div>
                </ListItem>
            ))}
        </List>
    ) : (
        <Center className={clsx(props.selectedTab !== 'modules' && classes.hidden, classes.empty)}>
            <Typography variant="body1" color="textSecondary">
                {browser.i18n.getMessage('optionsHiddenToDoItemDialogModulesEmpty')}
            </Typography>
        </Center>
    );
}
