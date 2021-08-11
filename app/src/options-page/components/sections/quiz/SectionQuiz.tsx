import React, { ReactElement } from 'react';
import ToggleOption from '../../options/ToggleOption';
import Indent from '../../options/Indent';
import DisableOptions from '../../options/DisableOptions';
import BallotIcon from '@material-ui/icons/Ballot';
import NoPaddingList from '../../NoPaddingList';
import Divider from '@material-ui/core/Divider';

export default {
    name: 'SectionQuiz',
    title: 'optionsSectionQuiz',
    Icon: BallotIcon,
    Component: function SectionQuiz(): ReactElement {
        return (
            <NoPaddingList>
                <ToggleOption
                    configKey="quiz.remindUnansweredQuestions.enabled"
                    message="optionsQuizRemindUnansweredQuestions"
                    description="optionsQuizRemindUnansweredQuestionsDescription"
                />
                <Indent>
                    <DisableOptions configKey="quiz.remindUnansweredQuestions.enabled">
                        <ToggleOption
                            configKey="quiz.remindUnansweredQuestions.sequentialQuizOnly"
                            message="optionsQuizRemindUnansweredQuestionsSequentialQuizOnly"
                        />
                    </DisableOptions>
                </Indent>
                <Divider />
                <ToggleOption
                    configKey="moreVisibleRemainingTime.enabled"
                    message="optionsMoreVisibleRemainingTime"
                    description="optionsMoreVisibleRemainingTimeDescription"
                />
            </NoPaddingList>
        );
    },
};
