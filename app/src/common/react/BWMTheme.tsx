import React, { ReactElement } from 'react';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

// Dark Reader に合わせたテーマを作る
const createTheme = () => {
    const style = getComputedStyle(document.documentElement);
    const bgColor = style.getPropertyValue('--darkreader-neutral-background').trim();
    const fgColor = style.getPropertyValue('--darkreader-neutral-text').trim();

    if (!bgColor || !fgColor) return createMuiTheme();

    const bgR = parseInt(bgColor.substr(1, 2), 16);
    const bgG = parseInt(bgColor.substr(3, 2), 16);
    const bgB = parseInt(bgColor.substr(5, 2), 16);
    const fgR = parseInt(fgColor.substr(1, 2), 16);
    const fgG = parseInt(fgColor.substr(3, 2), 16);
    const fgB = parseInt(fgColor.substr(5, 2), 16);

    const isDark = bgR + bgG + bgB < 500;
    const rgba = (r: number, g: number, b: number, a: number) => `rgba(${r},${g},${b},${a})`;
    if (isDark) {
        return createMuiTheme({
            palette: {
                type: 'dark',
                text: {
                    primary: rgba(fgR, fgG, fgB, 1),
                    secondary: rgba(fgR, fgG, fgB, 0.7),
                    disabled: rgba(fgR, fgG, fgB, 0.5),
                },
                background: {
                    default: rgba(bgR, bgG, bgB, 1),
                    paper: rgba(bgR * 1.5, bgG * 1.5, bgB * 1.5, 1),
                },
            },
        });
    } else {
        return createMuiTheme({
            palette: {
                type: 'light',
                text: {
                    primary: rgba(fgR, fgG, fgB, 0.87),
                    secondary: rgba(fgR, fgG, fgB, 0.54),
                    disabled: rgba(fgR, fgG, fgB, 0.38),
                },
                background: {
                    default: rgba(bgR, bgG, bgB, 1),
                    paper: rgba(bgR, bgG, bgB, 1),
                },
            },
        });
    }
};

export default function BWMTheme(props: { children: ReactElement; }): ReactElement {
    return <ThemeProvider theme={createTheme()}>{props.children}</ThemeProvider>;
}