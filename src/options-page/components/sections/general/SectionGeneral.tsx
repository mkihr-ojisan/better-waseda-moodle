import SettingsIcon from "@mui/icons-material/Settings";
import { Divider, List } from "@mui/material";
import React from "react";
import { OptionsPageSection } from "../../OptionsPage";
import { OptionBackupConfig } from "./OptionBackupConfig";
import { OptionRestoreConfig } from "./OptionRestoreConfig";
import { StorageUsage } from "./StorageUsage";

export default {
    id: "general",
    title: "options_page_section_general_title",
    Icon: SettingsIcon,
    Component: () => {
        return (
            <List disablePadding>
                <OptionBackupConfig />
                <Divider />
                <OptionRestoreConfig />
                <Divider />
                <StorageUsage />
            </List>
        );
    },
} satisfies OptionsPageSection;
