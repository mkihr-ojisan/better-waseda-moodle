import { ensureLogin } from '../../../../../auto-login/auto-login';
import { fetchHtml } from '../../../../util/util';
import { CourseModule } from './course-module';

export type CourseModuleAssignContent = {
    submissionSummary: {
        submissionStatus?: string;
        gradingStatus?: string;
    };
    feedback: {
        grade?: string;
    };
};

export async function fetchCourseModuleAssignContent(
    module: CourseModule<'assign'>
): Promise<CourseModuleAssignContent> {
    await ensureLogin();

    const modulePage = await fetchHtml(`https://wsdmoodle.waseda.jp/mod/assign/view.php?id=${module.id}`);

    const submissionSummary = getSubmissionSummary(modulePage);
    const feedback = getFeedback(modulePage);

    return {
        submissionSummary,
        feedback,
    };
}

const submissionSummaryLabels: [keyof Required<CourseModuleAssignContent>['submissionSummary'], Set<string>][] = [
    [
        'submissionStatus',
        new Set([
            '提出ステータス',
            'Submission status',
            'Abgabestatus',
            'Estado de la entrega',
            'Statut des travaux remis',
            'Stato consegna',
            'Status ingestuurde opdracht',
            '繳交狀態',
            '作业状态',
            'Состояние ответа на задание',
            '제출 상태',
        ]),
    ],
    [
        'gradingStatus',
        new Set([
            '評定ステータス',
            'Grading status',
            'Bewertungsstatus',
            'Estado de la calificación',
            "Statut de l'évaluation",
            'Stato valutazione',
            'Beoordelingsstatus',
            '評分狀態',
            '评分状态',
            'Состояние оценивания',
            '채점 상태',
        ]),
    ],
];
function getSubmissionSummary(doc: HTMLDocument): CourseModuleAssignContent['submissionSummary'] {
    const submissionStatusTable = doc.getElementsByClassName('submissionsummarytable')[0];
    if (!submissionStatusTable) return {};

    const summary: CourseModuleAssignContent['submissionSummary'] = {};

    for (const tr of Array.from(submissionStatusTable.getElementsByTagName('tr'))) {
        const th = tr.getElementsByTagName('th')[0]?.innerText?.trim();
        const td = tr.getElementsByTagName('td')[0]?.innerText?.trim();
        if (!th || !td) continue;

        const i = submissionSummaryLabels.findIndex((l) => l[1].has(th));
        if (i >= 0) summary[submissionSummaryLabels[i][0]] = td;
    }

    return summary;
}

const feedbackLabels: [keyof CourseModuleAssignContent['feedback'], Set<string>][] = [
    [
        'grade',
        new Set([
            '評点',
            'Grade',
            'Bewertung',
            'Calificación',
            'Note',
            'Valutazione',
            'Cijfer',
            '成績',
            '成绩',
            'Оценка',
            '성적',
        ]),
    ],
];
function getFeedback(doc: HTMLDocument): CourseModuleAssignContent['feedback'] {
    const feedbackTable = doc.getElementsByClassName('feedbacktable')[0];
    if (!feedbackTable) return {};

    const feedback: CourseModuleAssignContent['feedback'] = {};

    for (const tr of Array.from(feedbackTable.getElementsByTagName('tr'))) {
        const th = tr.getElementsByTagName('th')[0]?.innerText?.trim();
        const td = tr.getElementsByTagName('td')[0]?.innerText?.trim();
        if (!th || !td) continue;

        const i = feedbackLabels.findIndex((l) => l[1].has(th));
        if (i >= 0) feedback[feedbackLabels[i][0]] = td;
    }

    return feedback;
}
