import makeStyles from '@mui/styles/makeStyles';
import Grid, { GridSize } from '@mui/material/Grid';
import React, { ReactElement } from 'react';
import { CourseListItem } from '../../common/waseda/course/course';
import CourseCard from './course-card/CourseCard';

type Props = {
    courses: CourseListItem[];
    cardWidth?: GridSize;
    emptyView?: ReactElement;
};

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export default React.memo(function CourseListView(props: Props): ReactElement {
    const courses = props.courses.sort(compareCourse).map((c) => (
        <Grid
            item
            xs={props.cardWidth ?? 12}
            sm={props.cardWidth ?? 6}
            md={props.cardWidth ?? 4}
            lg={props.cardWidth ?? 4}
            xl={props.cardWidth ?? 3}
            key={c.id}
        >
            <CourseCard course={c} />
        </Grid>
    ));
    const classes = useStyles();

    if (courses.length > 0 || !props.emptyView) {
        return (
            <Grid container spacing={1} alignContent="stretch" classes={{ root: classes.root }}>
                {courses}
            </Grid>
        );
    } else {
        return props.emptyView;
    }
});

function compareCourse(a: CourseListItem, b: CourseListItem) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}
