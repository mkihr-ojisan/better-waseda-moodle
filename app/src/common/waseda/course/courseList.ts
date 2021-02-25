import { Course, CourseListItem } from '../../course';
import { postJson } from '../../util/util';
import { fetchSessionKey } from '../sessionKey';
import * as idb from 'idb-keyval';
import parseEntities from 'parse-entities';

const cacheStore = idb.createStore('courseListCache', 'courseListCache');

export async function fetchCourseList(options: FetchCourseListOptions = {}): Promise<CourseListItem[]> {
    const cache: CourseListItem[] | undefined = await idb.get('cache', cacheStore);
    if (!options.forceFetch && cache) {
        doFetchCourseList(); //update cache
        return cache;
    } else {
        return await doFetchCourseList();
    }
}

async function doFetchCourseList() {
    const requests = [
        [{
            args: {
                classification: 'all',
                customfieldname: '',
                customfieldvalue: '',
                limit: 0,
                offset: 0,
                sort: 'fullname',
            },
            index: 0,
            methodname: 'core_course_get_enrolled_courses_by_timeline_classification',
        }],
        [{
            args: {
                classification: 'hidden',
                customfieldname: '',
                customfieldvalue: '',
                limit: 0,
                offset: 0,
                sort: 'fullname',
            },
            index: 0,
            methodname: 'core_course_get_enrolled_courses_by_timeline_classification',
        }],
    ];

    const sessionKey = await fetchSessionKey();

    const courseList = [];
    for (const request of requests) {
        try {
            const response = await postJson(`https://wsdmoodle.waseda.jp/lib/ajax/service.php?sesskey=${sessionKey}&info=core_course_get_enrolled_courses_by_timeline_classification`, request) as Response;

            if (response[0].error)
                throw Error(response[0].exception?.message);
            if (!response[0].data)
                throw Error('data is null');

            for (const course of response[0].data.courses) {
                courseList.push({
                    id: course.id,
                    name: parseEntities(course.fullname),
                    startDate: new Date(course.startdate * 1000),
                    endDate: new Date(course.enddate * 1000),
                    isHidden: course.hidden,
                    imageUrl: course.courseimage,
                    isFavorite: course.isfavourite,
                    category: course.coursecategory,
                });
            }

        } catch (ex) {
            throw Error(`received invalid response: ${ex.message}`);
        }
    }

    idb.set('cache', courseList, cacheStore);

    return courseList;
}

export interface FetchCourseListOptions {
    forceFetch?: boolean;
}

type Response = [{
    error: boolean;
    exception?: {
        message: string;
        errorcode: string;
        link: string;
        moreinfourl: string;
    };
    data?: {
        courses: [
            {
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
            }
        ];
        nextoffset: number;
    };
}];

export async function setHiddenFromCourseList(course: Course, isHidden: boolean): Promise<void> {
    const request = [{
        args: {
            preferences: [{
                type: `block_myoverview_hidden_course_${course.id}`,
                value: isHidden ? true : null,
            }],
        },
        index: 0,
        methodname: 'core_user_update_user_preferences',
    }];

    const response = await postJson(`https://wsdmoodle.waseda.jp/lib/ajax/service.php?sesskey=${await fetchSessionKey()}&info=core_user_update_user_preferences`, request);

    if (response[0]?.error) {
        throw Error(response[0]?.exception?.message ?? 'invalid response');
    }

    const cache: CourseListItem[] | undefined = await idb.get('cache', cacheStore);
    if (cache) {
        const index = cache.findIndex(c => c.id === course.id);
        if (index >= 0) {
            cache[index].isHidden = isHidden;
            await idb.set('cache', cache, cacheStore);
        }
    }
}