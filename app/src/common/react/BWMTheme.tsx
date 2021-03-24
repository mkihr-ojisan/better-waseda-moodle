import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { ErrorBoundary } from 'react-error-boundary';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

// Dark Reader に合わせたテーマを作る
const useDarkReaderTheme = () => {
    const style = getComputedStyle(document.documentElement);
    const [bgColor, setBgColor] = useState(style.getPropertyValue('--darkreader-neutral-background').trim());
    const [fgColor, setFgColor] = useState(style.getPropertyValue('--darkreader-neutral-text').trim());

    useEffect(() => {
        //darkreaderによるstyleの変更を監視する
        const observer = new MutationObserver(records => {
            for (const record of records) {
                if (
                    Array.from(record.addedNodes).some(node => node instanceof HTMLStyleElement && node.classList.contains('darkreader')) ||
                    Array.from(record.removedNodes).some(node => node instanceof HTMLStyleElement && node.classList.contains('darkreader')) ||
                    record.target.parentNode instanceof HTMLStyleElement && record.target.parentNode.classList.contains('darkreader')
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

    if (!bgColor || !fgColor) return createMuiTheme();

    const bgR = parseInt(bgColor.substr(1, 2), 16);
    const bgG = parseInt(bgColor.substr(3, 2), 16);
    const bgB = parseInt(bgColor.substr(5, 2), 16);
    const fgR = parseInt(fgColor.substr(1, 2), 16);
    const fgG = parseInt(fgColor.substr(3, 2), 16);
    const fgB = parseInt(fgColor.substr(5, 2), 16);

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

    return createMuiTheme({
        palette,
        overrides: {
            MuiButtonBase: {
                root: {
                    outline: '0 !important', // Moodleではbutton:focusにoutlineが設定されていてそっちが優先されてしまうので!importantで打ち消す
                },
            },
        },
    });
};


export default function BWMTheme(props: { children: ReactNode; }): ReactElement {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
        >
            <ThemeProvider theme={useDarkReaderTheme()}>
                {props.children}
            </ThemeProvider>
        </ErrorBoundary>
    );
}

function ErrorFallback({ error }: { error: Error; }): ReactElement {
    return <p>error: {error.message}</p>;
}