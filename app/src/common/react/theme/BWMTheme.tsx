import { ThemeOptions } from '@material-ui/core';

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
    overrides: {
        MuiButtonBase: {
            root: {
                outline: '0 !important', // Moodleではbutton:focusにoutlineが設定されていてそっちが優先されてしまうので!importantで打ち消す
            },
        },
        MuiInputBase: {
            input: {
                boxShadow: 'none !important', // [role="button"]:focus
            },
        },
        MuiCssBaseline: {
            '@global': {
                a: {
                    color: PRIMARY_COLOR,
                },
            },
        },
    },
};
