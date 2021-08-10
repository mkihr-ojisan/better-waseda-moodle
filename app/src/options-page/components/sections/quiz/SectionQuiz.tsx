import React, { ReactElement } from 'react';
import List from '@material-ui/core/List';
import ToggleOption from '../../options/ToggleOption';
import Indent from '../../options/Indent';
import DisableOptions from '../../options/DisableOptions';
import BallotIcon from '@material-ui/icons/Ballot';

export default {
    title: 'optionsSectionQuiz',
    Icon: BallotIcon,
    Component: function SectionQuiz(): ReactElement {
        return (
            <List>
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
                <ToggleOption
                    configKey="moreVisibleRemainingTime.enabled"
                    message="optionsMoreVisibleRemainingTime"
                    description="optionsMoreVisibleRemainingTimeDescription"
                />
            </List>
        );
    },
};
