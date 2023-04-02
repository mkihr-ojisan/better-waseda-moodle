import { MoodleRequest, MoodleSuccessResponse, callMoodleAPI } from "./moodle";

export type ActionEvent = {
    id?: number;
    name?: string;
    description?: string;
    descriptionformat?: number;
    location?: string;
    categoryid?: null;
    groupid?: null;
    userid?: number;
    repeatid?: null;
    eventcount?: null;
    component?: string;
    modulename?: string;
    activityname?: string;
    activitystr?: string;
    instance?: number;
    eventtype?: string;
    timestart?: number;
    timeduration?: number;
    timesort: number;
    timeusermidnight?: number;
    visible?: number;
    timemodified?: number;
    overdue?: boolean;
    icon?: {
        key?: string;
        component?: string;
        alttext?: string;
    };
    course?: {
        id?: number;
        fullname?: string;
        shortname?: string;
        idnumber?: string;
        summary?: string;
        summaryformat?: number;
        startdate?: number;
        enddate?: number;
        visible?: boolean;
        showactivitydates?: boolean;
        showcompletionconditions?: boolean | null;
        fullnamedisplay?: string;
        viewurl?: string;
        courseimage?: string;
        progress?: number;
        hasprogress?: boolean;
        isfavourite?: boolean;
        hidden?: boolean;
        showshortname?: boolean;
        coursecategory?: string;
    };
    subscription?: {
        displayeventsource?: boolean;
    };
    canedit?: boolean;
    candelete?: boolean;
    deleteurl?: string;
    editurl?: string;
    viewurl?: string;
    formattedtime?: string;
    isactionevent?: boolean;
    iscourseevent?: boolean;
    iscategoryevent?: boolean;
    groupname?: null;
    normalisedeventtype?: string;
    normalisedeventtypetext?: string;
    action?: {
        name?: string;
        url?: string;
        itemcount?: number;
        actionable?: boolean;
        showitemcount?: boolean;
    };
    purpose?: string;
    url?: string;
};

type GetActionEventsByTimesortRequest = {
    aftereventid?: number;
    limitnum: number;
    limittononsuspendedevents: true;
    timesortfrom: number;
};
type GetActionEventsByTimesortResponse = {
    events: ActionEvent[];
    firstid: number;
    lastid: number;
};

/**
 * ダッシュボードのタイムラインに表示されるイベント一覧を取得する
 *
 * @param timesortfrom - イベントの開始時刻の最小値
 * @returns イベント一覧
 */
export async function core_calendar_get_action_events_by_timesort(timesortfrom: number): Promise<ActionEvent[]> {
    const LIMIT = 50;

    const events: ActionEvent[] = [];

    for (;;) {
        const request: MoodleRequest<GetActionEventsByTimesortRequest> = {
            args: {
                aftereventid: events[events.length - 1]?.id,
                limitnum: LIMIT,
                limittononsuspendedevents: true,
                timesortfrom,
            },
            methodname: "core_calendar_get_action_events_by_timesort",
        };
        const response: MoodleSuccessResponse<GetActionEventsByTimesortResponse> = await callMoodleAPI([request]);

        events.push(...response[0].data.events);

        if (response[0].data.events.length < LIMIT) break;
    }

    return events;
}
