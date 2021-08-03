import React, { ReactElement } from 'react';
import { SectionComponentProps } from '../../Options';
import Section from '../../Section';
import OptionMoreVisibleRemainingTime from './OptionMoreVisibleRemainingTime';
import OptionRemindUnansweredQuestions from './OptionRemindUnansweredQuestions';
import OptionRemindUnansweredQuestionsSequentialQuizOnly from './OptionRemindUnansweredQuestionsSequentialQuizOnly';

export default React.memo(function SectionQuiz(props: SectionComponentProps): ReactElement | null {
    return (
        <Section titleMessageName="optionsSectionQuiz" {...props}>
            <OptionMoreVisibleRemainingTime />
            <OptionRemindUnansweredQuestions />
            <OptionRemindUnansweredQuestionsSequentialQuizOnly />
        </Section>
    );
});
