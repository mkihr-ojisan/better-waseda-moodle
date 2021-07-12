import { createMuiTheme, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { bwmThemeOptions } from './BWMTheme';

// DarkReaderで設定された背景色と文字色を取得する
function useDarkReaderColor(): { bgR: number; bgG: number; bgB: number; fgR: number; fgG: number; fgB: number } | null {
    const style = getComputedStyle(document.documentElement);
    const [bgColor, setBgColor] = useState(style.getPropertyValue('--darkreader-neutral-background').trim());
    const [fgColor, setFgColor] = useState(style.getPropertyValue('--darkreader-neutral-text').trim());

    useEffect(() => {
        //darkreaderによるstyleの変更を監視する
        const observer = new MutationObserver((records) => {
            for (const record of records) {
                if (
                    Array.from(record.addedNodes).some(
                        (node) => node instanceof HTMLStyleElement && node.classList.contains('darkreader')
                    ) ||
                    Array.from(record.removedNodes).some(
                        (node) => node instanceof HTMLStyleElement && node.classList.contains('darkreader')
                    ) ||
                    (record.target.parentNode instanceof HTMLStyleElement &&
                        record.target.parentNode.classList.contains('darkreader'))
                ) {
                    const style = getComputedStyle(document.documentElement);
                    setBgColor(style.getPropertyValue('--darkreader-neutral-background').trim());
                    setFgColor(style.getPropertyValue('--darkreader-neutral-text').trim());
                    return;
                }
            }
        });
        observer.observe(document.head, { subtree: true, characterData: true, childList: true });
        return () => observer.disconnect();
    }, []);

    return useMemo(() => {
        if (!bgColor || !fgColor) return null;

        return {
            bgR: parseInt(bgColor.substr(1, 2), 16),
            bgG: parseInt(bgColor.substr(3, 2), 16),
            bgB: parseInt(bgColor.substr(5, 2), 16),
            fgR: parseInt(fgColor.substr(1, 2), 16),
            fgG: parseInt(fgColor.substr(3, 2), 16),
            fgB: parseInt(fgColor.substr(5, 2), 16),
        };
    }, [bgColor, fgColor]);
}

function useDarkReaderTheme(): Theme {
    const darkReaderColor = useDarkReaderColor();

    return useMemo(() => {
        if (!darkReaderColor) {
            return createMuiTheme(bwmThemeOptions);
        }

        const { bgR, bgG, bgB, fgR, fgG, fgB } = darkReaderColor;

        const isDark = bgR + bgG + bgB < 500;
        const rgba = (r: number, g: number, b: number, a: number) => `rgba(${r},${g},${b},${a})`;
        let palette: PaletteOptions;
        if (isDark) {
            palette = {
                type: 'dark',
                text: {
                    primary: rgba(fgR, fgG, fgB, 1),
                    secondary: rgba(fgR, fgG, fgB, 0.7),
                    disabled: rgba(fgR, fgG, fgB, 0.5),
                },
                background: {
                    default: rgba(bgR, bgG, bgB, 1),
                    paper: rgba(bgR + 20, bgG + 20, bgB + 20, 1),
                },
            };
        } else {
            palette = {
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
            };
        }

        const newTheme = createMuiTheme({
            ...bwmThemeOptions,
            palette: {
                ...bwmThemeOptions.palette,
                ...palette,
            },
        });

        return newTheme;
    }, [darkReaderColor]);
}

export default function BWMThemeDarkReader(props: { children: ReactNode }): ReactElement {
    return <ThemeProvider theme={useDarkReaderTheme()}>{props.children}</ThemeProvider>;
}
