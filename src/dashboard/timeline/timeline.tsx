import { ConfigKey, getConfig } from "@/common/config/config";
import { NotificationContextProvider } from "@/common/react/notification";
import { BWMRoot } from "@/common/react/root";
import React from "react";
import { createRoot } from "react-dom/client";
import { Timeline } from "./components/Timeline";

/**
 * ダッシュボードに表示するタイムラインの機能を初期化する
 */
export function initTimeline(): void {
    if (!getConfig(ConfigKey.TimelineShowInDashboard)) return;

    const parent = document.getElementById("block-region-content");
    if (!parent) return;

    const elem = document.createElement("div");
    elem.id = "bwm-timeline-root";
    parent.appendChild(elem);

    createRoot(elem).render(
        <>
            <style>
                {`
                #bwm-timeline-root img {
                    vertical-align: unset;
                }
                `}
            </style>

            <h5 className="card-title">{browser.i18n.getMessage("timeline_title")}</h5>
            <BWMRoot>
                <NotificationContextProvider>
                    <Timeline />
                </NotificationContextProvider>
            </BWMRoot>
        </>
    );
}
