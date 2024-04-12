import { assertExtensionContext } from "../../util/context";
import { callMoodleMobileAPI } from "./mobileAPI";
import { callMoodleAPI } from "./moodle";

assertExtensionContext("background");

type GetEnrolledCoursesByTimelineClassificationRequest = {
    classification:
        | "all"
        | "inprogress"
        | "future"
        | "past"
        | "favourites"
        | "hidden"
        | "allincludinghidden"
        | "search"
        | "customfield";
    customfieldname: string;
    customfieldvalue: string;
    limit: number;
    offset: number;
    sort: "fullname" | "ul.timeaccess desc";
};
export type EnrolledCourse = {
    id: number;
    fullname?: string;
    shortname?: string;
    idnumber?: string;
    summary?: string;
    summaryformat?: number;
    startdate?: number;
    enddate?: number;
    visible?: boolean;
    showactivitydates?: boolean;
    showcompletionconditions?: boolean;
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
type GetEnrolledCoursesByTimelineClassificationResponse = {
    courses: EnrolledCourse[];
    nextoffset: number;
};

/** 受講している科目のリストを取得する */
export async function core_course_get_enrolled_courses_by_timeline_classification(): Promise<EnrolledCourse[]> {
    const courses: EnrolledCourse[] = [];

    const limit = 1000;
    let offset = 0;

    for (;;) {
        const response = await callMoodleAPI<
            GetEnrolledCoursesByTimelineClassificationRequest,
            GetEnrolledCoursesByTimelineClassificationResponse
        >([
            {
                methodname: "core_course_get_enrolled_courses_by_timeline_classification",
                args: {
                    classification: "allincludinghidden",
                    customfieldname: "",
                    customfieldvalue: "",
                    limit,
                    offset,
                    sort: "fullname",
                },
            },
        ]);

        courses.push(...response[0].data.courses);

        offset = response[0].data.nextoffset;

        if (response[0].data.courses.length < limit) {
            break;
        }
    }

    return courses;
}

export type GetContentsRequest = {
    courseid: number;
    options?: [
        {
            name: string;
            value: string;
        }
    ];
};

export type GetContentsResponse = CourseSection[];
export type CourseSection = {
    id: number;
    name: string;
    visible?: boolean;
    summary: string;
    summaryformat: number;
    section: number;
    hiddenbynumsections?: number;
    uservisible?: boolean;
    availabilityinfo?: string;
    modules: CourseModule[];
};
export type CourseModule = {
    id: number;
    url?: string;
    name: string;
    instance?: number;
    contextid?: number;
    description?: string;
    visible?: number;
    uservisible?: boolean;
    availabilityinfo?: string;
    visibleoncoursepage?: number;
    modicon: string;
    modname: string;
    purpose?: string;
    modplural: string;
    availability?: string;
    indent: number;
    onclick?: string;
    afterlink?: string;
    activitybadge?: {
        badgecontent?: string;
        badgestyle?: string;
        badgeurl?: string;
        badgeelementid?: string;
        badgeextraattributes?: {
            name?: string;
            value?: string;
        }[];
    };
    customdata?: string;
    noviewlink?: boolean;
    completion?: number;
    completiondata?: {
        state: number;
        timecompleted?: number;
        overrideby?: number;
        valueused: boolean;
        hascompletion: boolean;
        isautomatic: boolean;
        istrackeduser: boolean;
        uservisible: boolean;
        details: {
            rulename: string;
            rulevalue: {
                status: number;
                description: string;
            };
        }[];
    };
    downloadcontent?: number;
    dates: {
        label: string;
        timestamp: number;
        relativeto?: number;
        dataid?: string;
    }[];
    groupmode?: number;
    contents?: {
        type: string;
        filename: string;
        filepath?: string;
        filesize: number;
        fileurl?: string;
        content?: string;
        timecreated?: number;
        timemodified?: number;
        sortorder?: number;
        mimetype?: string;
        isexternalfile?: boolean;
        repositorytype?: string;
        userid?: number;
        author?: string;
        license?: string;
        tags?: {
            id: number;
            name: string;
            rawname: string;
            isstandard: boolean;
            tagcollid: number;
            taginstanceid: number;
            taginstancecontextid: number;
            itemid: number;
            ordering: number;
            flag?: number;
            viewurl?: string;
        }[];
    }[];
    contentsinfo?: {
        filescount: number;
        filesize: number;
        lastmodified: number;
        mimetypes: string[];
        repositorytype?: string;
    };
};

/**
 * コースのコンテンツを取得する
 *
 * @param request - 引数
 * @returns コンテンツ
 */
export async function core_course_get_contents(request: GetContentsRequest): Promise<CourseSection[]> {
    const response = await callMoodleMobileAPI<GetContentsRequest, GetContentsResponse>({
        methodname: "core_course_get_contents",
        args: request,
    });

    return response;
}
