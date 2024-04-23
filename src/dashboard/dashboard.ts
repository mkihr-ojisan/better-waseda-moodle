import { initConfig } from "@/common/config/config";
import { initCourseOverview } from "./course-overview/course-overview";
import { initTimeline } from "./timeline/timeline";

(async () => {
    await initConfig();

    initCourseOverview();
    initTimeline();

    const systemMaintenanceBlockElem = document.querySelector("#block-region-content > section:nth-of-type(2) > div");
    if (systemMaintenanceBlockElem instanceof HTMLElement) {
        systemMaintenanceBlockElem.style.cssText = "padding-left: 0 !important; padding-right: 0 !important;";
    }
})();
