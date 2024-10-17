import { ConfigKey, getConfig } from "@/common/config/config";
import { NotificationContextProvider } from "@/common/react/notification";
import React from "react";
import { createRoot } from "react-dom/client";
import { BWMRoot } from "../../common/react/root";
import { assertExtensionContext } from "../../common/util/context";
import { CourseOverview } from "./components/CourseOverview";

assertExtensionContext("content_script");

/**
 * コース概要の機能を初期化する。
 */
export function initCourseOverview(): void {
    if (getConfig(ConfigKey.CourseOverviewEnabled)) {
        const elem = document.getElementsByClassName("block-starredcourses")[0]?.parentElement;
        if (!elem) return;
        (elem as HTMLElement).style.display = "none";

        const titleElem = document.querySelector(".block_starredcourses h3");
        if (titleElem) {
            titleElem.textContent = browser.i18n.getMessage("options_page_section_course_overview_title");
        }

        const root = document.createElement("div");
        root.id = "bwm-timetable-root";
        elem.insertAdjacentElement("afterend", root);

        createRoot(root).render(
            <BWMRoot>
                <NotificationContextProvider>
                    <CourseOverview />
                </NotificationContextProvider>
            </BWMRoot>
        );
    }
}
