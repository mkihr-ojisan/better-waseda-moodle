import { List } from "@mui/material";
import { OptionsPageSection } from "../../OptionsPage";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import React, { useState } from "react";
import { ConfigToggleOption } from "../../items/ToggleOption";
import { ConfigKey } from "@/common/config/config";
import { Action } from "../../items/Action";
import { HiddenEventsDialog } from "./HiddenEventsDialog";
import { OptionTimelineDateRange } from "./OptionTimelineDateRange";

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
                <Action
                    message="options_page_section_timeline_hidden_events"
                    buttonMessage="options_page_section_timeline_hidden_events_button"
                    onClick={handleHiddenEventsDialogOpen}
                />
                <OptionTimelineDateRange />

                <HiddenEventsDialog open={hiddenEventsDialogOpen} onClose={handleHiddenEventsDialogClose} />
            </List>
        );
    },
} satisfies OptionsPageSection;
