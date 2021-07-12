import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { ReactElement, ReactNode, useMemo } from 'react';
import { bwmThemeOptions } from './BWMTheme';

export default function BWMThemePrefersColorScheme(props: { children: ReactNode }): ReactElement {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(
        () =>
            createMuiTheme({
                ...bwmThemeOptions,
                palette: {
                    ...bwmThemeOptions.palette,
                    type: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode]
    );

    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
