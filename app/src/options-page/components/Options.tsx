import React, { ReactElement } from 'react';
import BWMThemePrefersColorScheme from '../../common/react/theme/BWMThemePrefersColorScheme';
import SectionGeneral from './sections/general/SectionGeneral';
import SectionAutoLogin from './sections/SectionAutoLogin';
import SectionDashboard from './sections/course-overview/SectionCourseOverview';
import SectionOthers from './sections/SectionOthers';
import SectionQuiz from './sections/quiz/SectionQuiz';
import { ConfigContextProvider } from '../../common/react/ConfigContext';

export type SectionComponentProps = {
    expanded: boolean;
    onChange: (_: React.ChangeEvent<{}>, newExpanded: boolean) => void;
};

const sections: React.FunctionComponent<SectionComponentProps>[] = [
    SectionGeneral,
    SectionAutoLogin,
    SectionDashboard,
    SectionQuiz,
    SectionOthers,
];

export default function Options(): ReactElement {
    const [expanded, setExpanded] = React.useState<number | null>(null);

    function handleChange(i: number) {
        return (_: React.ChangeEvent<{}>, newExpanded: boolean) => setExpanded(newExpanded ? i : null);
    }

    return (
        <ConfigContextProvider>
            <BWMThemePrefersColorScheme>
                {sections.map((SectionComponent, i) => (
                    <SectionComponent key={i} expanded={expanded === i} onChange={handleChange(i)} />
                ))}
            </BWMThemePrefersColorScheme>
        </ConfigContextProvider>
    );
}
