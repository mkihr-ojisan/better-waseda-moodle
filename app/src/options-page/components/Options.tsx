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

    const [expanded, setExpanded] = React.useState<string | false>(false);

    function handleChange(name: string) {
        return (_: React.ChangeEvent<{}>, newExpanded: boolean) => setExpanded(newExpanded ? name : false);
    }

    return (
        <ThemeProvider theme={theme}>
            {
                sections.map(SectionComponent => (
                    <SectionComponent
                        key={SectionComponent.name}
                        expanded={expanded === SectionComponent.name}
                        onChange={handleChange(SectionComponent.name)}
                    />
                ))
            }
        </ThemeProvider>
    );
}