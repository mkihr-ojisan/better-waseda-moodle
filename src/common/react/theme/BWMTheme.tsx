import { CSSInterpolation, ThemeOptions } from "@mui/material";

export const PRIMARY_COLOR = "#ed6c00";
export const SECONDARY_COLOR = "#cc0624";

/** Moodleが設定しているスタイルを解除する */
export const globalStyleOverride: CSSInterpolation = {
    label: {
        marginBottom: "unset",
    },
    "a:not([class]):focus": {
        outline: "unset",
        color: PRIMARY_COLOR,
        backgroundColor: "unset",
        boxShadow: "unset",
    },
    "[role=button]:focus": {
        boxShadow: "unset",
    },
    p: {
        marginBottom: "unset",
    },
};

export const bwmThemeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: PRIMARY_COLOR,
        },
        secondary: {
            main: SECONDARY_COLOR,
        },
    },
    typography: {
        fontFamily: "sans-serif",
    },
    components: {
        MuiScopedCssBaseline: {
            styleOverrides: {
                root: {
                    ...globalStyleOverride,
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                root: {
                    ...globalStyleOverride,
                },
            },
        },
        MuiModal: {
            styleOverrides: {
                root: {
                    ...globalStyleOverride,
                },
            },
        },
        MuiDialog: {
            defaultProps: {
                PaperProps: {
                    elevation: 1,
                },
            },
        },
    },
};
