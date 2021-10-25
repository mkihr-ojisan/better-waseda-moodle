import { MessengerClient } from '../../../util/messenger';
import { fetchHtml } from '../../../util/util';
import { Course } from '../course';
import { CourseSection, parseSection } from './course-section';

export type CourseContent = {
    courseId: number;
    sections: CourseSection[];
};

export async function fetchCourseContent(course: Course): Promise<CourseContent> {
    await MessengerClient.exec('ensureLogin');

    const page = await fetchHtml(`https://wsdmoodle.waseda.jp/course/view.php?id=${course.id}`);

    const sections: CourseSection[] = [];
    for (let i = 0; ; i++) {
        const sectionElem = page.getElementById(`section-${i}`);
        if (!sectionElem) break;
        sections.push(parseSection(sectionElem));
    }

    return {
        courseId: course.id,
        sections,
    };
}
