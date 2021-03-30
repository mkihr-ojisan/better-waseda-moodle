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
import { CourseListItem } from '../../../common/waseda/course/course';
import { CourseOverviewContext } from './CourseOverview';
import TimetableSettingsDialog from './TimetableSettingsDialog';

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
    listItemIconRoot: {
        minWidth: 40,
    },
}));


export default function CourseCard(props: Props): ReactElement {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [timetableSettingsDialogOpen, setTimetableSettingsDialogOpen] = useState(false);
    const context = useContext(CourseOverviewContext);

    const handleOpenMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
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

    return (
        <Card className={classes.root}>
            <CardMedia
                component="img"
                alt={props.course.name}
                height="112"
                image={props.course.imageUrl}
                title={props.course.name}
            />
            <CardHeader
                disableTypography={true}
                classes={{
                    action: classes.cardHeaderAction,
                }}
                title={
                    <Typography variant="body1">
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
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
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