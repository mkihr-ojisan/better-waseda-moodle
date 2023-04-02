import React from "react";
import { OptionsPageSection } from "../../OptionsPage";
import LoginIcon from "@mui/icons-material/Login";
import { ConfigToggleOption } from "../../items/ToggleOption";
import { ConfigKey } from "@/common/config/config";
import { OptionUserId } from "./OptionUserId";
import { List } from "@mui/material";
import { OptionPassword } from "./OptionPassword";
import { ConfigDisableOptions } from "../../items/DisableOptions";

export default {
    id: "auto-login",
    title: "options_page_section_auto_login_title",
    Icon: LoginIcon,
    Component: () => {
        return (
            <List disablePadding>
                <ConfigToggleOption
                    configKey={ConfigKey.AutoLoginEnabled}
                    message="options_page_section_auto_login_enabled"
                    description="options_page_section_auto_login_enabled_description"
                />
                <ConfigDisableOptions configKey={ConfigKey.AutoLoginEnabled}>
                    <OptionUserId />
                    <OptionPassword />
                </ConfigDisableOptions>
            </List>
        );
    },
} satisfies OptionsPageSection;
