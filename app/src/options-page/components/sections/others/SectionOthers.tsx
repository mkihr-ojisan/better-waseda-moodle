import React, { ReactElement } from 'react';
import ToggleOption from '../../options/ToggleOption';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Divider from '@material-ui/core/Divider';
import NoPaddingList from '../../NoPaddingList';

export default {
    name: 'SectionOthers',
    title: 'optionsSectionOthers',
    Icon: MoreHorizIcon,
    Component: function SectionQuiz(): ReactElement {
        return (
            <NoPaddingList>
                <ToggleOption
                    configKey="viewInBrowser.enabled"
                    message="optionsViewInBrowserEnabled"
                    description="optionsViewInBrowserDescription"
                />
                <Divider />
                <ToggleOption
                    configKey="removeLoadingVideo.enabled"
                    message="optionsRemoveLoadingVideo"
                    description="optionsRemoveLoadingVideoDescription"
                    useMarkdownForDescription
                />
                <Divider />
                <ToggleOption
                    configKey="checkNotesOnSubmitting.enabled"
                    message="optionsCheckNotesOnSubmitting"
                    description="optionsCheckNotesOnSubmittingDescription"
                />
                <Divider />
                <ToggleOption
                    configKey="disableRateLimit.enabled"
                    message="optionsDisableRateLimitEnabled"
                    description="optionsDisableRateLimitEnabledDescription"
                />
                <Divider />
                <ToggleOption
                    configKey="hideName.enabled"
                    message="optionsHideNameEnabled"
                    description="optionsHideNameEnabledDescription"
                />
                <Divider />
                <ToggleOption
                    configKey="syllabusLinkFix.enabled"
                    message="optionsSyllabusLinkFixEnabled"
                    description="optionsSyllabusLinkFixEnabledDescription"
                />
                <Divider />
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
            </NoPaddingList>
        );
    },
};
