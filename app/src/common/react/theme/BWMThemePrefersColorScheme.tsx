import { ThemeProvider, StyledEngineProvider, createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { ReactElement, ReactNode, useMemo } from 'react';
import { bwmThemeOptions } from './BWMTheme';

export default React.memo(function BWMThemePrefersColorScheme(props: { children: ReactNode }): ReactElement {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(() => {
        const options: ThemeOptions & { palette: PaletteOptions } = {
            ...bwmThemeOptions,
            palette: {
                ...bwmThemeOptions.palette,
                mode: prefersDarkMode ? 'dark' : 'light',
            },
        };

        if (prefersDarkMode) {
            // options.paletteにbackgroundプロパティが存在すると値がundefinedでもcreateThemeが補完してくれないので、
            // 上でbackground: prefersDarkMode ? {...} : undefinedみたいに書かずに下のように書く。
            options.palette.background = {
                default: '#1c1b22',
                paper: '#23222b',
            };
        }

        return createTheme(options);
    }, [prefersDarkMode]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
        </StyledEngineProvider>
    );
});
