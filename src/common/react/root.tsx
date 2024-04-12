import { CssBaseline, ScopedCssBaseline } from "@mui/material";
import React, { useMemo, FC, PropsWithChildren, StrictMode, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getCurrentExtensionContext } from "../util/context";
import { ErrorFallback } from "./error-fallback";
import { BWMThemeDarkReader } from "./theme/BWMThemeDarkReader";
import { BWMThemePrefersColorScheme } from "./theme/BWMThemePrefersColorScheme";

export const BWMRoot: FC<PropsWithChildren> = (props) => {
    const context = useMemo(() => getCurrentExtensionContext(), []);

    useEffect(() => {
        if (process.env.VENDOR === "firefox") {
            // これがないとuseMediaQueryが動かない
            window.matchMedia = window.matchMedia.bind(window);
        }
    }, []);

    switch (context) {
        case "content_script":
            // コンテンツスクリプト内では、Dark Readerの設定に応じてテーマを変える
            return (
                <StrictMode>
                    <BWMThemeDarkReader>
                        <ScopedCssBaseline>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>{props.children}</ErrorBoundary>
                        </ScopedCssBaseline>
                    </BWMThemeDarkReader>
                </StrictMode>
            );
        case "extension_page":
            // 拡張機能ページでは、prefers-color-schemeに応じてテーマを変える
            return (
                <StrictMode>
                    <BWMThemePrefersColorScheme>
                        <CssBaseline />
                        <ErrorBoundary FallbackComponent={ErrorFallback}>{props.children}</ErrorBoundary>
                    </BWMThemePrefersColorScheme>
                </StrictMode>
            );
        default:
            throw Error("unsupported context");
    }
};
