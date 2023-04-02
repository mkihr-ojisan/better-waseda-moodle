import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { OptionsPageSection } from "../../OptionsPage";
import React from "react";
import { Divider, List } from "@mui/material";
import { ConfigToggleOption } from "../../items/ToggleOption";
import { ConfigKey } from "@/common/config/config";

export default {
    id: "fix-style",
    title: "options_page_section_fix_style_title",
    Icon: AutoFixHighIcon,
    Component: () => {
        return (
            <List disablePadding>
                <ConfigToggleOption
                    configKey={ConfigKey.ReduceCourseContentPaddingEnabled}
                    message="options_page_section_fix_style_reduce_course_content_padding_enabled"
                    description="options_page_section_fix_style_reduce_course_content_padding_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.RemoveFloatingActionButtonsEnabled}
                    message="options_page_section_fix_style_remove_floating_action_buttons_enabled"
                    description="options_page_section_fix_style_remove_floating_action_buttons_enabled_description"
                />
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.RemoveNotificationBadgeEnabled}
                    message="options_page_section_fix_style_remove_notification_badge_enabled"
                    description="options_page_section_fix_style_remove_notification_badge_enabled_description"
                />
            </List>
        );
    },
} satisfies OptionsPageSection;
