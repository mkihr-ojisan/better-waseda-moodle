import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import { NumberFormat } from "@/common/util/intl";
import { ListItem, ListItemText, TextField, Typography } from "@mui/material";
import React, { FC, useContext } from "react";
import { DisableOptionsContext } from "../../items/DisableOptions";

const numberFormat = new NumberFormat({ style: "unit", unit: "day", useGrouping: false });

export const OptionTimelineDateRange: FC = () => {
    const disabled = useContext(DisableOptionsContext);

    const [backwardDays, setBackwardDays] = useConfig(ConfigKey.TimelineBackwardDays);
    const [forwardDays, setForwardDays] = useConfig(ConfigKey.TimelineForwardDays);

    const color = disabled ? "text.disabled" : "text.primary";

    return (
        <ListItem sx={{ flexWrap: "wrap", justifyContent: "end" }}>
            <ListItemText primaryTypographyProps={{ color }}>
                {browser.i18n.getMessage("options_page_section_timeline_date_range")}
            </ListItemText>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "end", width: "auto" }}>
                <Typography variant="body1" color={color}>
                    {browser.i18n.getMessage("options_page_section_timeline_date_range_from")}
                </Typography>
                {numberFormat.formatToParts(backwardDays).map((part) => {
                    if (part.type === "integer") {
                        return (
                            <TextField
                                key={part.type}
                                variant="standard"
                                type="number"
                                value={part.value}
                                onChange={(e) => setBackwardDays(parseInt(e.target.value))}
                                sx={{ width: 100 }}
                                inputProps={{ min: 0 }}
                                disabled={disabled}
                            />
                        );
                    } else {
                        return (
                            <Typography variant="body1" color={color} key={part.type}>
                                {part.value}
                            </Typography>
                        );
                    }
                })}
                <Typography variant="body1" color={color}>
                    {browser.i18n.getMessage("options_page_section_timeline_date_range_ago_to")}
                </Typography>
                {numberFormat.formatToParts(forwardDays).map((part) => {
                    if (part.type === "integer") {
                        return (
                            <TextField
                                key={part.type}
                                variant="standard"
                                type="number"
                                value={part.value}
                                onChange={(e) => setForwardDays(parseInt(e.target.value))}
                                sx={{ width: 100 }}
                                inputProps={{ min: 0 }}
                                disabled={disabled}
                            />
                        );
                    } else {
                        return (
                            <Typography variant="body1" color={color} key={part.type}>
                                {part.value}
                            </Typography>
                        );
                    }
                })}
                <Typography variant="body1" color={color}>
                    {browser.i18n.getMessage("options_page_section_timeline_date_range_later")}
                </Typography>
            </div>
        </ListItem>
    );
};
