import { PaletteOptions, ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import React, { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { bwmThemeOptions } from "./BWMTheme";

/**
 * DarkReaderで設定された背景色と文字色を取得する
 *
 * @returns 背景色と文字色。DarkReaderが有効でない場合はnull
 */
function useDarkReaderColor(): { bgR: number; bgG: number; bgB: number; fgR: number; fgG: number; fgB: number } | null {
    const [bgColor, setBgColor] = useState<string>();
    const [fgColor, setFgColor] = useState<string>();

    useEffect(() => {
        const style = getComputedStyle(document.body);
        setBgColor(style.backgroundColor);
        setFgColor(style.color);
    }, []);

    useEffect(() => {
        //darkreaderによるstyleの変更を監視する
        const observer = new MutationObserver((records) => {
            for (const record of records) {
                if (
                    Array.from(record.addedNodes).some(
                        (node) => node instanceof HTMLStyleElement && node.classList.contains("darkreader")
                    ) ||
                    Array.from(record.removedNodes).some(
                        (node) => node instanceof HTMLStyleElement && node.classList.contains("darkreader")
                    ) ||
                    (record.target.parentNode instanceof HTMLStyleElement &&
                        record.target.parentNode.classList.contains("darkreader"))
                ) {
                    const style = getComputedStyle(document.documentElement);
                    setBgColor(style.backgroundColor);
                    setFgColor(style.color);
                    return;
                }
            }
        });
        observer.observe(document.head, { subtree: true, characterData: true, childList: true });
        return () => observer.disconnect();
    }, []);

    return useMemo(() => {
        if (!bgColor || !fgColor) return null;

        const bg = bgColor.split(/[(),]/).filter((s) => !!s);
        const fg = fgColor.split(/[(),]/).filter((s) => !!s);

        let bgR, bgG, bgB, fgR, fgG, fgB;
        if (bg[0] === "rbg") {
            [bgR, bgG, bgB] = bg.slice(1).map((s) => parseInt(s));
        } else {
            return null;
        }

        if (fg[0] === "rbg") {
            [fgR, fgG, fgB] = fg.slice(1).map((s) => parseInt(s));
        } else {
            return null;
        }

        return { bgR, bgG, bgB, fgR, fgG, fgB };
    }, [bgColor, fgColor]);
}

/**
 * DarkReaderの設定によってダークテーマとライトテーマが切り替わるThemeを生成する
 *
 * @returns DarkReaderの設定によってダークテーマとライトテーマが切り替わるTheme
 */
function useDarkReaderTheme(): Theme {
    const darkReaderColor = useDarkReaderColor();

    return useMemo(() => {
        if (!darkReaderColor) {
            return createTheme(bwmThemeOptions);
        }

        const { bgR, bgG, bgB, fgR, fgG, fgB } = darkReaderColor;

        const isDark = bgR + bgG + bgB < 127 * 3;
        const rgba = (r: number, g: number, b: number, a: number): string => `rgba(${r},${g},${b},${a})`;
        let palette: PaletteOptions;
        if (isDark) {
            palette = {
                mode: "dark",
                text: {
                    primary: rgba(fgR, fgG, fgB, 1),
                    secondary: rgba(fgR, fgG, fgB, 0.7),
                    disabled: rgba(fgR, fgG, fgB, 0.5),
                },
                background: {
                    default: rgba(bgR, bgG, bgB, 1),
                    paper: rgba(bgR, bgG, bgB, 1),
                },
                divider: rgba(fgR, fgG, fgB, 0.12),
            };
        } else {
            palette = {
                mode: "light",
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

        const newTheme = createTheme({
            ...bwmThemeOptions,
            palette: {
                ...bwmThemeOptions.palette,
                ...palette,
            },
        });

        return newTheme;
    }, [darkReaderColor]);
}

/**
 * DarkReaderの設定によってダークテーマとライトテーマが切り替わるThemeProvider
 *
 * @param props - プロパティ
 * @returns DarkReaderの設定によってダークテーマとライトテーマが切り替わるThemeProvider
 */
export const BWMThemeDarkReader: FC<PropsWithChildren> = (props) => {
    return <ThemeProvider theme={useDarkReaderTheme()}>{props.children}</ThemeProvider>;
};
