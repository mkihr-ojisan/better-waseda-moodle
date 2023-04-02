import { Divider, List } from "@mui/material";
import { OptionsPageSection } from "../../OptionsPage";
import BallotIcon from "@mui/icons-material/Ballot";
import React from "react";
import { ConfigToggleOption } from "../../items/ToggleOption";
import { ConfigKey } from "@/common/config/config";
import { ConfigDisableOptions } from "../../items/DisableOptions";

export default {
    id: "quiz",
    title: "options_page_section_quiz_title",
    Icon: BallotIcon,
    Component: () => {
        return (
            <List disablePadding>
                <ConfigToggleOption
                    configKey={ConfigKey.RemindUnansweredQuestionsEnabled}
                    message="options_page_section_quiz_remind_unanswered_questions_enabled"
                    description="options_page_section_quiz_remind_unanswered_questions_enabled_description"
                />
                <ConfigDisableOptions configKey={ConfigKey.RemindUnansweredQuestionsEnabled}>
                    <ConfigToggleOption
                        configKey={ConfigKey.RemindUnansweredQuestionsOnlySequentialQuiz}
                        message="options_page_section_quiz_remind_unanswered_questions_only_sequential_quiz"
                    />
                </ConfigDisableOptions>
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.MoreVisibleRemainingTimeEnabled}
                    message="options_page_section_quiz_more_visible_remaining_time_enabled"
                    description="options_page_section_quiz_more_visible_remaining_time_enabled_description"
                />
            </List>
        );
    },
} satisfies OptionsPageSection;
