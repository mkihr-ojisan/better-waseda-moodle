import { InvalidResponseError } from '../../../error';
import { CourseModule, parseModule } from './module/course-module';

export type CourseSection = {
    id: number;
    title: string;
    summaryHtml: string | undefined;
    modules: CourseModule[];
};

export function parseSection(elem: HTMLElement): CourseSection {
    const titleElemId = elem.getAttribute('aria-labelledby');
    if (!titleElemId) throw new InvalidResponseError('titleElemId is null');

    const id = parseInt(titleElemId.match(/^sectionid-([0-9]+)-title$/)?.[1] ?? '');
    if (isNaN(id)) throw new InvalidResponseError('id is NaN');

    const title = elem.ownerDocument.getElementById(titleElemId)?.innerText?.trim();
    if (!title) throw new InvalidResponseError('title is null');

    const summaryHtml = elem.getElementsByClassName('summary')[0]?.innerHTML;

    const modules: CourseModule[] = [];
    elem.querySelectorAll('ul.section > li').forEach((moduleElem) => {
        modules.push(parseModule(moduleElem as HTMLElement));
    });

    return {
        id,
        title,
        summaryHtml,
        modules,
    };
}
