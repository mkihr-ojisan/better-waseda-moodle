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
import { useEffect } from 'react';
import { MessengerClient } from '../../common/util/messenger';
import { OptionsPageParameter } from '../background-script';
import SectionToDoList from './sections/todo-list/SectionToDoList';

export const OPTIONS_PAGE_DRAWER_WIDTH = 240;

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
}));

export type OptionsPageSection = {
    name: string;
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
    SectionToDoList,
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
            setTimeout(() => setSelectedSectionIndex(index), 100); //うーん………
        },
        [scrollSignal]
    );
    const handleScrolledToSection = useCallback((index) => {
        setSelectedSectionIndex(index);
    }, []);

    useEffect(() => {
        (async () => {
            const param = (await MessengerClient.exec('getOptionsPageParameter')) as OptionsPageParameter;
            if (param?.defaultSelectedSection) {
                const index = OPTIONS_PAGE_SECTIONS.findIndex(
                    (section) => section.name === param.defaultSelectedSection
                );
                if (index !== -1) {
                    doScrollToSection(index);
                } else {
                    console.warn(`unknown section '${param.defaultSelectedSection}'`);
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
