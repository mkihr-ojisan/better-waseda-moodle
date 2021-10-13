export type Question = {
    type: QuestionType;
    isAnswered: boolean;
    elem: Element;
    name: string | undefined;
};
export type QuestionType =
    | 'calculated'
    | 'calculatedmulti'
    | 'calculatedsimple'
    | 'ddimageortext'
    | 'ddmarker'
    | 'ddwtos'
    | 'description'
    | 'essay'
    | 'gapselect'
    | 'match'
    | 'missingtype'
    | 'multianswer'
    | 'multichoice'
    | 'numerical'
    | 'random'
    | 'randomsamatch'
    | 'shortanswer'
    | 'tests'
    | 'truefalse'
    | 'multichoiceset'
    | 'unknown';

export function getQuestions(): Question[] {
    const questionElems = document.querySelectorAll('div[id^="question-"]');

    const questions: Question[] = [];
    questionElems.forEach((elem) => {
        const type = getQuestionType(elem);
        const isAnswered = checkIfAnswered(elem, type);
        const name = getQuestionName(elem);
        questions.push({ type, isAnswered, elem, name });
    });

    return questions;
}

function getQuestionType(elem: Element): QuestionType {
    const types: QuestionType[] = [
        'calculated',
        'calculatedmulti',
        'calculatedsimple',
        'ddimageortext',
        'ddmarker',
        'ddwtos',
        'description',
        'essay',
        'gapselect',
        'match',
        'missingtype',
        'multianswer',
        'multichoice',
        'numerical',
        'random',
        'randomsamatch',
        'shortanswer',
        'tests',
        'truefalse',
        'multichoiceset',
    ];
    return types.find((type) => elem.classList.contains(type)) ?? 'unknown';
}

function getQuestionName(elem: Element): string | undefined {
    return elem.querySelector('h3')?.innerText;
}

function checkIfAnswered(elem: Element, type: QuestionType): boolean {
    switch (type) {
        case 'calculated':
        case 'calculatedsimple':
        case 'numerical':
        case 'shortanswer':
            return Array.from(elem.querySelectorAll('input[type=text]')).every(
                (e) => (e as HTMLInputElement).value !== ''
            );
        case 'calculatedmulti':
        case 'multichoice':
        case 'multichoiceset': {
            const names: Record<string, boolean | undefined> = {};
            for (const radio of Array.from(elem.querySelectorAll('input[type=radio]')) as HTMLInputElement[]) {
                if (!names[radio.name] && radio.value !== '-1') {
                    names[radio.name] = radio.checked;
                }
            }
            if (Object.values(names).every((checked) => checked)) return true;

            return Array.from(elem.querySelectorAll('input[type=checkbox]')).some(
                (e) => (e as HTMLInputElement).checked
            );
        }
        case 'ddmarker':
            return Array.from(elem.querySelectorAll('.ddform > input')).some(
                (e) => (e as HTMLInputElement).value !== ''
            );
        case 'ddimageortext':
        case 'ddwtos':
            return Array.from(elem.querySelectorAll('input[type=hidden].placeinput')).every(
                (e) => (e as HTMLInputElement).value !== '0' && (e as HTMLInputElement).value !== ''
            );
        case 'description':
            return true;
        case 'essay':
            {
                const htmlEditorContent = elem.querySelector('.editor_atto_content_wrap');
                if (htmlEditorContent) {
                    if (htmlEditorContent.innerHTML.trim() !== '') return true;
                    if (
                        htmlEditorContent.querySelector('img') ||
                        htmlEditorContent.querySelector('audio') ||
                        htmlEditorContent.querySelector('video')
                    )
                        return true;
                } else {
                    const textArea = elem.querySelector('.qtype_essay_response');
                    if (textArea && textArea.textContent !== '') return true;
                }
                const filePicker = elem.querySelector('.filemanager');
                if (filePicker) {
                    if (!filePicker.classList.contains('fm-noitems')) return true;
                }
            }
            return false;
        case 'gapselect':
            return Array.from(elem.querySelectorAll('select')).every((e) => e.value !== '');
        case 'match':
        case 'randomsamatch':
            return Array.from(elem.querySelectorAll('select')).every((e) => e.value !== '0');
        case 'truefalse': {
            const names: Record<string, boolean | undefined> = {};
            for (const radio of Array.from(elem.querySelectorAll('input[type=radio]')) as HTMLInputElement[]) {
                if (!names[radio.name]) {
                    names[radio.name] = radio.checked;
                }
            }
            return Object.values(names).every((checked) => checked);
        }
        case 'random':
        case 'multianswer':
        case 'tests':
        case 'missingtype':
        case 'unknown':
            console.warn('unknown type of question');
            return true;
    }
}
