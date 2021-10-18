import { ThemeOptions } from '@mui/material';

export const PRIMARY_COLOR = '#ed6c00';
export const SECONDARY_COLOR = '#cc0624';

export const bwmThemeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: PRIMARY_COLOR,
        },
        secondary: {
            main: SECONDARY_COLOR,
        },
    },
    components: {
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    outline: '0 !important', // Moodleではbutton:focusにoutlineが設定されていてそっちが優先されてしまうので!importantで打ち消す
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    boxShadow: 'none !important', // [role="button"]:focus
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '@global': {
                    a: {
                        color: PRIMARY_COLOR,
                    },
                },
            },
        },
    },
};
