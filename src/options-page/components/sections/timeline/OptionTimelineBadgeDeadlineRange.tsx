import { ListItem, ListItemText, TextField, Typography } from "@mui/material";
import React, { FC, useContext } from "react";
import { DisableOptionsContext } from "../../items/DisableOptions";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";

export const OptionTimelineBadgeDeadlineRange: FC = () => {
    const disabled = useContext(DisableOptionsContext);

    const [value, setValue] = useConfig(ConfigKey.TimelineBadgeDeadlineRange);
    const [timelineForwardDays] = useConfig(ConfigKey.TimelineForwardDays);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const days = parseInt(event.target.value);
        setValue(days * 24 * 60 * 60 * 1000);
    };

    const color = disabled ? "text.disabled" : "text.primary";

    return (
        <ListItem sx={{ flexWrap: "wrap" }}>
            <ListItemText
                primary={browser.i18n.getMessage("options_page_section_timeline_badge_deadline_range")}
                primaryTypographyProps={{ color }}
            />
            <div style={{ display: "flex", alignItems: "baseline" }}>
                <Typography variant="body1" color={color}>
                    {browser.i18n.getMessage("options_page_section_timeline_badge_deadline_range_before")}
                </Typography>
                <TextField
                    value={value / (24 * 60 * 60 * 1000)}
                    onChange={handleChange}
                    disabled={disabled}
                    type="number"
                    variant="standard"
                    inputProps={{ min: 0, max: timelineForwardDays }}
                    sx={{ width: "100px" }}
                />
                <Typography variant="body1" color={color}>
                    {browser.i18n.getMessage("options_page_section_timeline_badge_deadline_range_after")}
                </Typography>
            </div>
        </ListItem>
    );
};
