import makeStyles from '@mui/styles/makeStyles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import React, { ReactElement, useContext } from 'react';
import { useMediaQuery } from '../../../common/polyfills/useMediaQuery';
import CourseListView from '../CourseListView';
import { CourseOverviewContext } from '../CourseOverview';

type Props = {
    open: boolean;
    onClose?: () => void;
};

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export default React.memo(function HiddenCoursesDialog(props: Props): ReactElement {
    const classes = useStyles();
    const context = useContext(CourseOverviewContext);

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md" fullScreen={isSmallScreen}>
            <DialogTitle>
                {browser.i18n.getMessage('courseOverviewHiddenCoursesDialogTitle')}
                <IconButton classes={{ root: classes.closeButton }} onClick={props.onClose} size="large">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <CourseListView
                    courses={context.courseList.filter((c) => c.isHidden)}
                    cardWidth={isSmallScreen ? undefined : 4}
                    emptyView={
                        <DialogContentText>
                            {browser.i18n.getMessage('coursesOverviewHiddenCoursesDialogEmpty')}
                        </DialogContentText>
                    }
                />
            </DialogContent>
        </Dialog>
    );
});
