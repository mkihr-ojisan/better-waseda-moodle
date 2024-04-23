import { Divider, List } from "@mui/material";
import { OptionsPageSection } from "../../OptionsPage";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import React, { useState } from "react";
import { ConfigToggleOption } from "../../items/ToggleOption";
import { ConfigKey } from "@/common/config/config";
import { Action } from "../../items/Action";
import { HiddenEventsDialog } from "./HiddenEventsDialog";
import { OptionTimelineDateRange } from "./OptionTimelineDateRange";
import { OptionTimelineBadgeDeadlineRange } from "./OptionTimelineBadgeDeadlineRange";
import { ConfigDisableOptions } from "../../items/DisableOptions";

export default {
    id: "timeline",
    title: "options_page_section_timeline_title",
    Icon: FormatListBulletedIcon,
    Component: () => {
        const [hiddenEventsDialogOpen, setHiddenEventsDialogOpen] = useState(false);
        const handleHiddenEventsDialogOpen = () => setHiddenEventsDialogOpen(true);
        const handleHiddenEventsDialogClose = () => setHiddenEventsDialogOpen(false);

        return (
            <List disablePadding>
                <ConfigToggleOption
                    configKey={ConfigKey.TimelineEnabled}
                    message="options_page_section_timeline_enabled"
                    description="options_page_section_timeline_enabled_description"
                />
                <ConfigDisableOptions configKey={ConfigKey.TimelineEnabled}>
                    <Action
                        message="options_page_section_timeline_hidden_events"
                        buttonMessage="options_page_section_timeline_hidden_events_button"
                        onClick={handleHiddenEventsDialogOpen}
                    />
                    <OptionTimelineDateRange />
                    <Divider />
                    <ConfigToggleOption
                        configKey={ConfigKey.TimelineBadgeEnabled}
                        message="options_page_section_timeline_badge_enabled"
                        description="options_page_section_timeline_badge_enabled_description"
                    />
                    <ConfigDisableOptions configKey={ConfigKey.TimelineBadgeEnabled}>
                        <OptionTimelineBadgeDeadlineRange />
                    </ConfigDisableOptions>
                </ConfigDisableOptions>
                <Divider />
                <ConfigToggleOption
                    configKey={ConfigKey.TimelineShowInDashboard}
                    message="options_page_section_timeline_show_in_dashboard"
                    description="options_page_section_timeline_show_in_dashboard_description"
                />

                <HiddenEventsDialog open={hiddenEventsDialogOpen} onClose={handleHiddenEventsDialogClose} />
            </List>
        );
    },
} satisfies OptionsPageSection;
