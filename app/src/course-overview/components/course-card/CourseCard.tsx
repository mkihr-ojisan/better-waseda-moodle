import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import MoreVert from '@mui/icons-material/MoreVert';
import React, { ReactElement, useContext, useState } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import CourseImage from './CourseImage';
import { CourseOverviewContext } from '../CourseOverview';
import CourseMenu from './CourseMenu';
import NoteIcon from '@mui/icons-material/Note';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { useCallback } from 'react';

type Props = {
    course: CourseListItem;
};

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
    },
    title: {
        color: theme.palette.text.primary,
    },
    cardHeaderAction: {
        marginTop: -4,
    },
    cardHeaderRoot: {
        alignItems: 'flex-start',
    },
    noteTooltip: {
        whiteSpace: 'break-spaces',
    },
}));

export default React.memo(function CourseCard(props: Props): ReactElement {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const context = useContext(CourseOverviewContext);

    const courseData = context.courseData[props.course.id];
    const courseName = courseData?.overrideName ?? props.course.name;

    const handleOpenMenuButtonClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const closeMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return (
        <Card className={classes.root}>
            <CourseImage alt={courseName} height="112" title={courseName} course={props.course} />
            <CardHeader
                disableTypography={true}
                classes={{
                    action: classes.cardHeaderAction,
                    root: classes.cardHeaderRoot,
                }}
                title={
                    <Typography variant="body1">
                        <a
                            className={classes.title}
                            href={`https://wsdmoodle.waseda.jp/course/view.php?id=${props.course.id}`}
                        >
                            {courseName}
                        </a>
                    </Typography>
                }
                action={
                    <Grid container direction="column">
                        <Grid item>
                            <IconButton edge={false} size="small" onClick={handleOpenMenuButtonClick}>
                                <MoreVert />
                            </IconButton>
                        </Grid>
                        {courseData?.note ? (
                            <Grid item>
                                <Tooltip
                                    classes={{ tooltip: classes.noteTooltip }}
                                    title={<Typography variant="body1">{courseData?.note}</Typography>}
                                >
                                    <IconButton edge={false} size="small">
                                        <NoteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        ) : null}
                    </Grid>
                }
            />

            <CourseMenu anchorEl={anchorEl} course={props.course} onClose={closeMenu} open={Boolean(anchorEl)} />
        </Card>
    );
});
