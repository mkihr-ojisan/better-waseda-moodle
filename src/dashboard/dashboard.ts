import { initConfig } from "@/common/config/config";
import { initCourseOverview } from "./course-overview/course-overview";
import { initTimeline } from "./timeline/timeline";

(async () => {
    await initConfig();

    initCourseOverview();
    initTimeline();

    for (const elem of Array.from(document.querySelectorAll("#block-region-content .card-body")) as HTMLElement[]) {
        elem.style.cssText = "padding-left: 0 !important; padding-right: 0 !important;";
    }
})();
