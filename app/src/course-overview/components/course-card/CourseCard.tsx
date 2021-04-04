import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { ReactElement, useContext, useState } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import CourseImage from './CourseImage';
import { CourseOverviewContext } from '../CourseOverview';
import CourseMenu from './CourseMenu';

type Props = {
    course: CourseListItem;
};

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    title: {
        color: theme.palette.text.primary,
    },
    cardHeaderAction: {
        marginTop: -4,
    },
}));


export default function CourseCard(props: Props): ReactElement {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const context = useContext(CourseOverviewContext);

    const courseName = context.courseData[props.course.id]?.overrideName ?? props.course.name;

    const handleOpenMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Card className={classes.root}>
            <CourseImage
                alt={courseName}
                height="112"
                title={courseName}
                course={props.course}
            />
            <CardHeader
                disableTypography={true}
                classes={{
                    action: classes.cardHeaderAction,
                }}
                title={
                    <Typography variant="body1">
                        <a className={classes.title} href={`https://wsdmoodle.waseda.jp/course/view.php?id=${props.course.id}`}>{courseName}</a>
                    </Typography>
                }
                action={
                    <IconButton edge={false} size="small" onClick={handleOpenMenuButtonClick}>
                        <MoreVert />
                    </IconButton>
                }
            />

            <CourseMenu
                anchorEl={anchorEl}
                course={props.course}
                onClose={closeMenu}
                open={Boolean(anchorEl)}
            />
        </Card>
    );
}