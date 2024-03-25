import { ActionEvent, core_calendar_get_action_events_by_timesort } from "../api/moodle/calendar";
import { ConfigKey, getConfig } from "../config/config";
import { assertExtensionContext } from "../util/context";
import { withCache } from "../util/withCache";

assertExtensionContext("background");

const cached_core_calendar_get_action_events_by_timesort = withCache(
    "timeline",
    603,
    () => {
        const backwardDays = getConfig(ConfigKey.TimelineBackwardDays);
        return core_calendar_get_action_events_by_timesort(Math.floor(Date.now() / 1000) - backwardDays * 24 * 60 * 60);
    },
    {
        cacheTtlMs: 7 * 24 * 60 * 60 * 1000,
        callIntervalMs: 60 * 1000,
    }
);

/**
 * Moodleのタイムラインを取得する。
 *
 * @param includeHidden - 非表示のイベントを含めるかどうか。
 * @yields タイムラインのイベントの配列。
 */
export async function* fetchMoodleTimeline(includeHidden?: boolean): AsyncGenerator<ActionEvent[], void> {
    const forwardDays = getConfig(ConfigKey.TimelineForwardDays);

    const hiddenEventIds = getConfig(ConfigKey.TimelineHiddenEventIds);
    const hiddenCourses = getConfig(ConfigKey.TimelineHiddenCourses);
    const hiddenModuleNames = getConfig(ConfigKey.TimelineHiddenModuleNames);

    for await (const events of cached_core_calendar_get_action_events_by_timesort()) {
        if (includeHidden) {
            yield events;
        } else {
            yield events.filter(
                (event) =>
                    event.timesort &&
                    event.timesort * 1000 - Date.now() <= forwardDays * 24 * 60 * 60 * 1000 &&
                    event.id &&
                    !hiddenEventIds.includes(event.id) &&
                    event.course?.id &&
                    !hiddenCourses.includes(event.course.id.toString()) &&
                    event.modulename &&
                    !hiddenModuleNames.includes(event.modulename)
            );
        }
    }
}

fetchMoodleTimeline.invalidateCache = cached_core_calendar_get_action_events_by_timesort.invalidateCache;
