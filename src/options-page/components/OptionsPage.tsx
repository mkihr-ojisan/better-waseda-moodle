import { Box } from "@mui/material";
import React, { ContextType, FC, createContext, useContext, useMemo, useState } from "react";
import SectionGeneral from "./sections/general/SectionGeneral";
import { OptionsPageDrawer } from "./OptionsPageDrawer";
import { OptionsPageAppBar } from "./OptionsPageAppBar";
import { OptionsPageContent } from "./OptionsPageContent";
import SectionAutoLogin from "./sections/auto-login/SectionAutoLogin";
import { NotificationContextProvider } from "@/common/react/notification";
import SectionCourseOverview from "./sections/course-overview/SectionCourseOverview";
import SectionQuiz from "./sections/quiz/SectionQuiz";
import SectionTimeline from "./sections/timeline/SectionTimeline";
import SectionOthers from "./sections/others/SectionOthers";
import SectionAbout from "./sections/about/SectionAbout";
import SectionFixStyle from "./sections/fix-style/SectionFixStyle";

const drawerWidth = 240;

export type OptionsPageSection = {
    id: string;
    title: string;
    Icon: React.FC;
    divider?: boolean;
    Component: React.FC;
};

const sections: OptionsPageSection[] = [
    SectionGeneral,
    SectionAutoLogin,
    SectionCourseOverview,
    SectionQuiz,
    SectionTimeline,
    SectionFixStyle,
    SectionOthers,
    SectionAbout,
];

const OptionsPageContext = createContext<
    | {
          drawerOpen: boolean;
          setDrawerOpen: (open: boolean | ((open: boolean) => boolean)) => void;
          currentSection: string;
          userSelectedSection: string | null;
          setUserSelectedSection: (section: string | null) => void;
          setCurrentSection: (section: string) => void;
      }
    | undefined
>(undefined);

export const OptionsPage: FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState(sections[0].id);
    const [userSelectedSection, setUserSelectedSection] = useState<string | null>(null);

    const context = useMemo(
        () => ({
            drawerOpen,
            setDrawerOpen,
            currentSection,
            userSelectedSection,
            setCurrentSection,
            setUserSelectedSection,
        }),
        [drawerOpen, currentSection, userSelectedSection]
    );

    return (
        <NotificationContextProvider>
            <OptionsPageContext.Provider value={context}>
                <Box sx={{ display: "flex" }}>
                    <OptionsPageAppBar />
                    <OptionsPageDrawer {...{ sections, drawerWidth }} />
                    <OptionsPageContent {...{ sections, drawerWidth }} />
                </Box>
            </OptionsPageContext.Provider>
        </NotificationContextProvider>
    );
};

/**
 * OptionsPageContextを使用するフック
 *
 * @returns OptionsPageContext
 */
export function useOptionsPageContext(): NonNullable<ContextType<typeof OptionsPageContext>> {
    const context = useContext(OptionsPageContext);
    if (!context) {
        throw new Error("useOptionsPageContext must be used within a OptionsPageContext");
    }
    return context;
}
