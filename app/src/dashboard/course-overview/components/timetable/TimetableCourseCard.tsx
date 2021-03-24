import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CalendarToday from '@material-ui/icons/CalendarToday';
import MoreVert from '@material-ui/icons/MoreVert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { ReactElement, useContext, useState } from 'react';
import { CourseListItem } from '../../../../common/course';
import { useMediaQuery } from '../../../../common/polyfills/useMediaQuery';
import { CourseOverviewContext } from '../CourseOverview';
import TimetableSettingsDialog from '../TimetableSettingsDialog';

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
    const [timetableSettingsDialogOpen, setTimetableSettingsDialogOpen] = useState(false);
    const context = useContext(CourseOverviewContext);

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('xs'));

    const handleOpenMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };
    const closeMenu = () => {
        setMenuOpen(false);
    };
    const handleHideCourse = () => {
        context.hideCourse(props.course);
        closeMenu();
    };
    const handleUnhideCourse = () => {
        context.unhideCourse(props.course);
        closeMenu();
    };
    const handleTimetableSettings = () => {
        setTimetableSettingsDialogOpen(true);
        closeMenu();
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
            <CardMedia
                component="img"
                alt={props.course.name}
                height="8"
                image={props.course.imageUrl}
                title={props.course.name}
                classes={{ root: classes.cardMediaRoot }}
            />
            <CardHeader
                disableTypography={true}
                classes={{
                    action: classes.cardHeaderAction,
                    root: classes.cardHeaderRoot,
                }}
                title={
                    <Typography variant="body1" classes={{ root: classes.cardHeaderTypographyRoot }}>
                        <a className={classes.title} href={`https://wsdmoodle.waseda.jp/course/view.php?id=${props.course.id}`}>{props.course.name}</a>
                    </Typography>
                }
                action={
                    <IconButton edge={false} size="small" onClick={handleOpenMenuButtonClick}>
                        <MoreVert />
                    </IconButton>
                }
            />
            <Menu
                anchorEl={isSmallScreen ? undefined : anchorEl}
                anchorPosition={isSmallScreen ? anchorPosition : undefined}
                anchorReference={isSmallScreen ? 'anchorPosition' : 'anchorEl'}
                keepMounted
                open={menuOpen}
                onClose={closeMenu}
            >
                {
                    props.course.isHidden ?
                        <MenuItem onClick={handleUnhideCourse}>
                            <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                <Visibility />
                            </ListItemIcon>
                            {browser.i18n.getMessage('courseOverviewUnhide')}
                        </MenuItem> :
                        <MenuItem onClick={handleHideCourse}>
                            <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                                <VisibilityOff />
                            </ListItemIcon>
                            {browser.i18n.getMessage('courseOverviewHide')}
                        </MenuItem>
                }
                <MenuItem onClick={handleTimetableSettings}>
                    <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
                        <CalendarToday />
                    </ListItemIcon>
                    {browser.i18n.getMessage('courseOverviewTimetableSettings')}
                </MenuItem>
            </Menu>
            <TimetableSettingsDialog course={props.course} open={timetableSettingsDialogOpen} onClose={() => setTimetableSettingsDialogOpen(false)} />
        </Card>
    );
}