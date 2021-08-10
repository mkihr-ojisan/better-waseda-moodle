import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import OptionsPageAppBar from './OptionsPageAppBar';
import OptionsPageDrawer from './OptionsPageDrawer';
import OptionsPageContent from './OptionsPageContent';
import BWMThemePrefersColorScheme from '../../common/react/theme/BWMThemePrefersColorScheme';
import { useState } from 'react';
import SectionGeneral from './sections/general/SectionGeneral';
import { useCallback } from 'react';
import SectionAutoLogin from './sections/auto-login/SectionAutoLogin';
import SectionCourseOverview from './sections/course-overview/SectionCourseOverview';
import { useSignal } from '../../common/react/signal';
import SectionQuiz from './sections/quiz/SectionQuiz';
import SectionOthers from './sections/others/SectionOthers';
import SectionAbout from './sections/about/SectionAbout';

export const OPTIONS_PAGE_DRAWER_WIDTH = 240;

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
}));

export type OptionsPageSection = {
    title: string;
    Icon: React.FC;
    divider?: boolean;
    Component: React.FC;
};
export const OPTIONS_PAGE_SECTIONS: OptionsPageSection[] = [
    SectionGeneral,
    SectionAutoLogin,
    SectionCourseOverview,
    SectionQuiz,
    SectionOthers,
    SectionAbout,
];

export default React.memo(function OptionsPage() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const scrollSignal = useSignal<number>();

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
    }, []);
    const handleDrawerOpen = useCallback(() => {
        setDrawerOpen(true);
    }, []);
    const doScrollToSection = useCallback(
        (index) => {
            scrollSignal.send(index);
        },
        [scrollSignal]
    );
    const handleScrolledToSection = useCallback((index) => {
        setSelectedSectionIndex(index);
    }, []);

    return (
        <BWMThemePrefersColorScheme>
            <div className={classes.root}>
                <CssBaseline />
                <OptionsPageAppBar onDrawerOpen={handleDrawerOpen} />
                <OptionsPageDrawer
                    drawerOpen={drawerOpen}
                    onCloseDrawer={handleDrawerClose}
                    selectedSectionIndex={selectedSectionIndex}
                    doScrollToSection={doScrollToSection}
                />
                <OptionsPageContent
                    selectedSectionIndex={selectedSectionIndex}
                    onScrolledToSection={handleScrolledToSection}
                    scrollSignal={scrollSignal}
                />
            </div>
        </BWMThemePrefersColorScheme>
    );
});
