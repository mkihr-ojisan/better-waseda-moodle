import React, { ReactElement } from 'react';
import List from '@material-ui/core/List';
import ToggleOption from '../../options/ToggleOption';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

export default {
    title: 'optionsSectionOthers',
    Icon: MoreHorizIcon,
    Component: function SectionQuiz(): ReactElement {
        return (
            <List>
                <ToggleOption
                    configKey="viewInBrowser.enabled"
                    message="optionsViewInBrowserEnabled"
                    description="optionsViewInBrowserDescription"
                />
                <ToggleOption
                    configKey="removeLoadingVideo.enabled"
                    message="optionsRemoveLoadingVideo"
                    description="optionsRemoveLoadingVideoDescription"
                    useMarkdownForDescription
                />
                <ToggleOption
                    configKey="checkNotesOnSubmitting.enabled"
                    message="optionsCheckNotesOnSubmitting"
                    description="optionsCheckNotesOnSubmittingDescription"
                />
                <ToggleOption
                    configKey="disableRateLimit.enabled"
                    message="optionsDisableRateLimitEnabled"
                    description="optionsDisableRateLimitEnabledDescription"
                />
                <ToggleOption
                    configKey="hideName.enabled"
                    message="optionsHideNameEnabled"
                    description="optionsHideNameEnabledDescription"
                />
                <ToggleOption
                    configKey="syllabusLinkFix.enabled"
                    message="optionsSyllabusLinkFixEnabled"
                    description="optionsSyllabusLinkFixEnabledDescription"
                />
                <ToggleOption
                    configKey="checkSession.enabled"
                    message="optionsCheckSessionEnabled"
                    description="optionsCheckSessionEnabledDescription"
                />
                {/*<Indent>
                    <DisableOptions configKey="checkSession.enabled">
                        <CheckBoxOption configKey="checkSession.quiz" message="optionsCheckSessionQuiz" dense />
                        <CheckBoxOption
                            configKey="checkSession.assignment"
                            message="optionsCheckSessionAssignment"
                            dense
                        />
                        <CheckBoxOption configKey="checkSession.forum" message="optionsCheckSessionForum" dense />
                    </DisableOptions>
                </Indent>*/}
            </List>
        );
    },
};
