import React from "react";
import { OptionsPageSection } from "../../OptionsPage";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Divider, List } from "@mui/material";
import { ConfigToggleOption } from "../../items/ToggleOption";
import { ConfigKey } from "@/common/config/config";
import { ConfigDisableOptions } from "../../items/DisableOptions";
import { ConfigTextBoxOption } from "../../items/TextBoxOption";

export default {
    id: "others",
    title: "options_page_section_others_title",
    Icon: MoreHorizIcon,
    Component: () => {
        return (
            <List disablePadding>
                <ConfigToggleOption
                    configKey={ConfigKey.ViewInBrowserEnabled}
                    message="options_page_section_others_view_in_browser_enabled"
                    description="options_page_section_others_view_in_browser_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.RemoveLoadingVideoEnabled}
                    message="options_page_section_others_remove_loading_video_enabled"
                    description="options_page_section_others_remove_loading_video_enabled_description"
                    useMarkdownForDescription
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.CheckNotesOnSubmittingEnabled}
                    message="options_page_section_others_check_notes_on_submitting_enabled"
                    description="options_page_section_others_check_notes_on_submitting_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.FixPortalLinkEnabled}
                    message="options_page_section_others_fix_portal_link_enabled"
                    description="options_page_section_others_fix_portal_link_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.FixSyllabusLinkEnabled}
                    message="options_page_section_others_fix_syllabus_link_enabled"
                    description="options_page_section_others_fix_syllabus_link_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.CheckSessionEnabled}
                    message="options_page_section_others_check_session_enabled"
                    description="options_page_section_others_check_session_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.AutoSessionExtensionEnabled}
                    message="options_page_section_others_auto_session_extension_enabled"
                    description="options_page_section_others_auto_session_extension_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.AssignmentFilenameEnabled}
                    message="options_page_section_others_assignment_filename_enabled"
                    description="options_page_section_others_assignment_filename_enabled_description"
                    useMarkdownForDescription
                />
                <ConfigDisableOptions configKey={ConfigKey.AssignmentFilenameEnabled}>
                    <ConfigTextBoxOption
                        configKey={ConfigKey.AssignmentFilenameTemplate}
                        message="options_page_section_others_assignment_filename_template"
                        textBoxWidth="100%"
                    />
                </ConfigDisableOptions>
            </List>
        );
    },
} satisfies OptionsPageSection;
