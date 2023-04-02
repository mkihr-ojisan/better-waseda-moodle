import { assertExtensionContext } from "../../../common/util/context";
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
