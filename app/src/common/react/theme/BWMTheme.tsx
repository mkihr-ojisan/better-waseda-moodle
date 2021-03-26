export const bwmThemeOptions = {
    palette: {
        primary: {
            main: '#ed6c00',
        },
        secondary: {
            main: '#cc0624',
        },
    },
    overrides: {
        MuiButtonBase: {
            root: {
                outline: '0 !important', // Moodleではbutton:focusにoutlineが設定されていてそっちが優先されてしまうので!importantで打ち消す
            },
        },
    },
};
