import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
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

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md" fullScreen={isSmallScreen}>
            <DialogTitle>
                {browser.i18n.getMessage('courseOverviewHiddenCoursesDialogTitle')}
                <IconButton classes={{ root: classes.closeButton }} onClick={props.onClose}>
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
