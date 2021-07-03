import React, { ReactElement } from 'react';
import { SectionComponentProps } from '../../Options';
import Section from '../../Section';
import OptionRemindUnansweredQuestions from './OptionRemindUnansweredQuestions';
import OptionRemindUnansweredQuestionsSequentialQuizOnly from './OptionRemindUnansweredQuestionsSequentialQuizOnly';

export default function SectionQuiz(props: SectionComponentProps): ReactElement | null {
    return (
        <Section titleMessageName="optionsSectionQuiz" {...props}>
            <OptionRemindUnansweredQuestions />
            <OptionRemindUnansweredQuestionsSequentialQuizOnly />
        </Section>
    );
}