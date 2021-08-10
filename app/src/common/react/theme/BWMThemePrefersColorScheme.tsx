import { ThemeProvider, createTheme, ThemeOptions } from '@material-ui/core/styles';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { ReactElement, ReactNode, useMemo } from 'react';
import { bwmThemeOptions } from './BWMTheme';

export default React.memo(function BWMThemePrefersColorScheme(props: { children: ReactNode }): ReactElement {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(() => {
        const options: ThemeOptions & { palette: PaletteOptions } = {
            ...bwmThemeOptions,
            palette: {
                ...bwmThemeOptions.palette,
                type: prefersDarkMode ? 'dark' : 'light',
            },
        };

        if (prefersDarkMode) {
            // options.paletteにbackgroundプロパティが存在すると値がundefinedでもcreateThemeが補完してくれないので、
            // 上でbackground: prefersDarkMode ? {...} : undefinedみたいに書かずに下のように書く。
            options.palette.background = {
                default: 'rgb(28, 27, 34)',
                paper: 'rgb(35, 34, 43)',
            };
        }

        return createTheme(options);
    }, [prefersDarkMode]);

    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
});
