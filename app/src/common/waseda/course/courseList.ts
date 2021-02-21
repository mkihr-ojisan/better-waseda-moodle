import { CourseListItem } from '../../course';
import { postJson } from '../../util/util';
import { fetchSessionKey } from '../sessionKey';

export async function fetchCourseList(options: FetchCourseListOptions = {}): Promise<CourseListItem[]> {
    const requests = [];

    requests.push([
        {
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
        },
    ]);

    if (options.includeHiddenCourses) {
        requests.push([
            {
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
            },
        ]);
    }

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
                    name: course.fullname,
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


    return courseList;
}

export interface FetchCourseListOptions {
    includeHiddenCourses?: boolean;
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