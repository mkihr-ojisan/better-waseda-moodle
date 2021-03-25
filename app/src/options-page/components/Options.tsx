import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React, { ReactElement, useMemo } from 'react';
import { useMediaQuery } from '../../common/polyfills/useMediaQuery';
import SectionAutoLogin from './sections/SectionAutoLogin';
import SectionDashboard from './sections/SectionCourseOverview';
import SectionOthers from './sections/SectionOthers';

export type SectionComponentProps = {
    expanded: boolean;
    onChange: (_: React.ChangeEvent<{}>, newExpanded: boolean) => void;
};

const sections: React.FunctionComponent<SectionComponentProps>[] = [
    SectionAutoLogin,
    SectionDashboard,
    SectionOthers,
];

export default function Options(): ReactElement {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(() => createMuiTheme({
        palette: {
            type: prefersDarkMode ? 'dark' : 'light',
        },
    }), [prefersDarkMode]);

    const [expanded, setExpanded] = React.useState<number | null>(null);

    function handleChange(i: number) {
        return (_: React.ChangeEvent<{}>, newExpanded: boolean) => setExpanded(newExpanded ? i : null);
    }

    return (
        <ThemeProvider theme={theme}>
            {
                sections.map((SectionComponent, i) => (
                    <SectionComponent
                        key={SectionComponent.name}
                        expanded={expanded === i}
                        onChange={handleChange(i)}
                    />
                ))
            }
        </ThemeProvider>
    );
}