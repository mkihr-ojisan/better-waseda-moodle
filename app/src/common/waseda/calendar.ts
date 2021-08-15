import { InvalidResponseError } from '../error';
import { MessengerServer } from '../util/messenger';
import { assertCurrentContextType, postJson } from '../util/util';
import { fetchSessionKey } from './session-key';
import * as idb from 'idb-keyval';
import AsyncLock from 'async-lock';
import { CachedPromise, createCachedPromise } from '../util/ExPromise';

assertCurrentContextType('background_script');

export type ActionEvent = {
    id: number;
    name: string;
    description: string;
    descriptionformat: number;
    location: string;
    categoryid: null;
    groupid: null;
    userid: null;
    repeatid: null;
    eventcount: null;
    component: string;
    modulename: string;
    instance: number;
    eventtype: string;
    timestart: number;
    timeduration: number;
    timesort: number;
    visible: number;
    timemodified: number;
    icon: {
        key: string;
        component: string;
        alttext: string;
    };
    course: {
        id: number;
        fullname: string;
        shortname: string;
        idnumber: string;
        summary: string;
        summaryformat: number;
        startdate: number;
        enddate: number;
        visible: boolean;
        fullnamedisplay: string;
        viewurl: string;
        courseimage: string;
        progress: number;
        hasprogress: boolean;
        isfavourite: boolean;
        hidden: boolean;
        showshortname: boolean;
        coursecategory: string;
    };
    subscription: {
        displayeventsource: boolean;
    };
    canedit: boolean;
    candelete: boolean;
    deleteurl: string;
    editurl: string;
    viewurl: string;
    formattedtime: string;
    isactionevent: boolean;
    iscourseevent: boolean;
    iscategoryevent: boolean;
    groupname: null;
    normalisedeventtype: string;
    normalisedeventtypetext: string;
    action: {
        name: string;
        url: string;
        itemcount: number;
        actionable: boolean;
        showitemcount: boolean;
    };
    url: string;
};

type Request = [
    {
        args: {
            aftereventid?: number;
            limitnum: number;
            limittononsuspendedevents: boolean;
            timesortfrom: number;
        };
        index: 0;
        methodname: 'core_calendar_get_action_events_by_timesort';
    }
];

type Response = [
    | {
          error: true;
          exception: {
              message: string;
              errorcode: string;
              link: string;
              moreinfourl: string;
          };
      }
    | {
          error: false;
          data: {
              events: ActionEvent[];
              firstid: number;
              lastid: number;
          };
      }
];

const cacheDB = idb.createStore('calendar_action_events_cache', 'calendar_action_events_cache');

export type FetchActionEventsByTimeSortOptions = {
    fromTimeSort?: Date;
    doNotResolveCache?: boolean;
};

const lock = new AsyncLock();
export function fetchActionEventsByTimeSort(
    options?: FetchActionEventsByTimeSortOptions
): CachedPromise<ActionEvent[]> {
    return createCachedPromise((resolveCache) =>
        lock.acquire('fetchActionEventsByTimeSort', async () => {
            const timesortfrom = Math.floor(
                (options?.fromTimeSort?.getTime() ?? Date.now() - 14 * 24 * 60 * 60 * 1000) / 1000
            );

            if (!options?.doNotResolveCache) {
                const cache: ActionEvent[] | undefined = await idb.get('cache', cacheDB);

                if (cache) {
                    resolveCache(cache.filter((event) => event.timesort > timesortfrom));
                }
            }

            const events: ActionEvent[] = [];
            const limit = 50;

            for (;;) {
                const request: Request = [
                    {
                        args: {
                            aftereventid: events[events.length - 1]?.id,
                            limitnum: limit, //max: 50 (https://github.com/moodle/moodle/blob/511a87f5fc357f18a4c53911f6e6c7f7b526246e/calendar/classes/local/api.php#L120)
                            limittononsuspendedevents: true,
                            timesortfrom,
                        },
                        index: 0,
                        methodname: 'core_calendar_get_action_events_by_timesort',
                    },
                ];

                const response: Response = await postJson(
                    `https://wsdmoodle.waseda.jp/lib/ajax/service.php?sesskey=${await fetchSessionKey()}`,
                    request
                );

                if (response[0].error) throw new InvalidResponseError(response[0].exception.message);

                events.push(...response[0].data.events);

                if (response[0].data.events.length < limit) break;
            }

            await Promise.all([idb.set('cache', events, cacheDB), idb.set('lastUpdate', new Date(), cacheDB)]);

            return events;
        })
    );
}
MessengerServer.addInstruction({ fetchActionEventsByTimeSort });
