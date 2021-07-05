import { InvalidResponseError } from '../../../../error';

export type CourseModule<T extends CourseModuleType = CourseModuleType> = {
    id: number;
    title?: string;
    type: T;
};
export type CourseModuleType = 'assign' | 'assignment' | 'book' | 'chat' | 'choice' | 'data' | 'feedback' | 'folder' | 'forum' | 'glossary' | 'h5pactvity' | 'imscp' | 'label' | 'lesson' | 'lti' | 'page' | 'quiz' | 'resource' | 'scorm' | 'survey' | 'url' | 'wiki' | 'workshop' | 'zoom' | 'unknown';

export function parseModule(elem: HTMLElement): CourseModule {
    const id = getModuleId(elem);
    const title = getModuleTitle(elem);
    const type = getModuleType(elem);

    return {
        id,
        title,
        type,
    };
}

function getModuleId(elem: HTMLElement): number {
    const id = parseInt(elem.id.match(/^module-([0-9]+)$/)?.[1] ?? '');
    if (isNaN(id)) throw new InvalidResponseError('id is NaN');
    return id;
}

function getModuleTitle(elem: HTMLElement): string | undefined {
    return (elem.getElementsByClassName('instancename')[0] as HTMLElement | undefined)?.innerText;
}

function getModuleType(elem: HTMLElement): CourseModuleType {
    const types: CourseModuleType[] = ['assign', 'assignment', 'book', 'chat', 'choice', 'data', 'feedback', 'folder', 'forum', 'glossary', 'h5pactvity', 'imscp', 'label', 'lesson', 'lti', 'page', 'quiz', 'resource', 'scorm', 'survey', 'url', 'wiki', 'workshop', 'zoom'];
    return types.find(t => elem.classList.contains('modtype_' + t)) ?? 'unknown';
}