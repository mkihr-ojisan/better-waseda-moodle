import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { ReactElement, useContext, useState } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import { useMediaQuery } from '../../../common/polyfills/useMediaQuery';
import { CourseOverviewContext } from '../CourseOverview';
import CourseImage from '../course-card/CourseImage';
import CourseMenu from '../course-card/CourseMenu';

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
    cardMediaRoot: {
        objectPosition: 'center top',
    },
    cardHeaderRoot: {
        [theme.breakpoints.between('sm', 'lg')]: {
            padding: theme.spacing(1),
        },
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            padding: theme.spacing(1) / 2,
        },
    },
    cardHeaderTypographyRoot: {
        wordBreak: 'break-all',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8rem',
            lineHeight: '1.2em',
        },
    },
    cardHeaderAction: {
        marginTop: -4,
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    listItemIconRoot: {
        minWidth: 40,
    },
}));


export default function CourseCard(props: Props): ReactElement {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
    const context = useContext(CourseOverviewContext);

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('xs'));

    const courseName = context.courseData[props.course.id]?.overrideName ?? props.course.name;

    const handleOpenMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };
    const closeMenu = () => {
        setMenuOpen(false);
    };
    const handleContextMenu: React.MouseEventHandler = event => {
        if (!menuOpen) {
            event.preventDefault();
            setAnchorPosition({ top: event.clientY, left: event.clientX });
            setMenuOpen(true);
        }
    };

    return (
        <Card
            className={classes.root}
            onContextMenu={isSmallScreen ? handleContextMenu : undefined}
        >
            <CourseImage
                alt={courseName}
                height="8"
                title={courseName}
                course={props.course}
                classes={{ cardMediaRoot: classes.cardMediaRoot }}
            />
            <CardHeader
                disableTypography={true}
                classes={{
                    action: classes.cardHeaderAction,
                    root: classes.cardHeaderRoot,
                }}
                title={
                    <Typography variant="body1" classes={{ root: classes.cardHeaderTypographyRoot }}>
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
                course={props.course}
                anchorEl={isSmallScreen ? undefined : anchorEl}
                anchorPosition={isSmallScreen ? anchorPosition : undefined}
                anchorReference={isSmallScreen ? 'anchorPosition' : 'anchorEl'}
                open={menuOpen}
                onClose={closeMenu}
            />
        </Card>
    );
}