import { ActionEvent } from "@/common/api/moodle/calendar";
import { ConfigKey, addOnConfigChangeListener, getConfig } from "@/common/config/config";
import { fetchMoodleTimeline } from "@/common/timeline/timeline";
import { combinePromise } from "@/common/util/combine-promise";

const BADGE_UPDATE_ALARM_NAME = "badge_update";

/**
 * バッジの表示機能を初期化する。
 */
export function initBadge(): void {
    browser.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === BADGE_UPDATE_ALARM_NAME) {
            updateBadge();
        }
    });

    addOnConfigChangeListener(ConfigKey.TimelineEnabled, updateBadge);
    addOnConfigChangeListener(ConfigKey.TimelineForwardDays, updateBadge);
    addOnConfigChangeListener(ConfigKey.TimelineBackwardDays, updateBadge);
    addOnConfigChangeListener(ConfigKey.TimelineHiddenCourses, updateBadge);
    addOnConfigChangeListener(ConfigKey.TimelineHiddenEventIds, updateBadge);
    addOnConfigChangeListener(ConfigKey.TimelineHiddenModuleNames, updateBadge);
    addOnConfigChangeListener(ConfigKey.TimelineBadgeEnabled, updateBadge);
    addOnConfigChangeListener(ConfigKey.TimelineBadgeDeadlineRange, updateBadge);

    updateBadge();
}

export const updateBadge = combinePromise(async () => {
    if (!getConfig(ConfigKey.TimelineEnabled) || !getConfig(ConfigKey.TimelineBadgeEnabled)) {
        browser.action.setBadgeText({ text: "" });
        return;
    }

    let events: ActionEvent[] | undefined = undefined;
    try {
        if (!(await browser.action.getBadgeText({}))) {
            browser.action.setBadgeBackgroundColor({ color: "#555" });
            browser.action.setBadgeText({ text: "..." });
        }

        for await (const value of fetchMoodleTimeline()) {
            events = value;
        }

        if (!events) throw Error("events is undefined");

        const now = Date.now();
        const until = (now + getConfig(ConfigKey.TimelineBadgeDeadlineRange)) / 1000;
        const count = events.filter((event) => event.timesort < until).length;

        browser.action.setBadgeText({ text: count.toString() });
        browser.action.setBadgeBackgroundColor({ color: count > 0 ? "#eb0014" : "#555" });
        browser.action.setBadgeTextColor({ color: "#fff" });
    } catch (e) {
        console.warn("failed to update badge", e);
    }

    browser.alarms.create(BADGE_UPDATE_ALARM_NAME, { delayInMinutes: 60 });
});
