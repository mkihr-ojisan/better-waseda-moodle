import { createStore } from 'idb-keyval';
import { Course, CourseRegistrationInfo } from '../../course';

const courseInfoCache = createStore('courseInfoCache', 'courseInfoCache');

export async function fetchCourseRegistrationInfo(courses: Course[]): Promise<Map<Course, CourseRegistrationInfo | null>> {
    //TODO: implement
    return new Map(courses.map(c => [c, null]));
}
