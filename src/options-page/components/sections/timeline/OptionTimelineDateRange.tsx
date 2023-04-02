import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import { NumberFormat } from "@/common/util/intl";
import { ListItem, ListItemSecondaryAction, ListItemText, Stack, TextField } from "@mui/material";
import React, { FC } from "react";

const numberFormat = new NumberFormat({ style: "unit", unit: "day", useGrouping: false });

export const OptionTimelineDateRange: FC = () => {
    const [backwardDays, setBackwardDays] = useConfig(ConfigKey.TimelineBackwardDays);
    const [forwardDays, setForwardDays] = useConfig(ConfigKey.TimelineForwardDays);

    return (
        <ListItem>
            <ListItemText>{browser.i18n.getMessage("options_page_section_timeline_date_range")}</ListItemText>
            <ListItemSecondaryAction>
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <div>{browser.i18n.getMessage("options_page_section_timeline_date_range_from")}</div>
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
                                />
                            );
                        } else {
                            return <div key={part.type}>{part.value}</div>;
                        }
                    })}
                    <div>{browser.i18n.getMessage("options_page_section_timeline_date_range_ago_to")}</div>
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
                                />
                            );
                        } else {
                            return <div key={part.type}>{part.value}</div>;
                        }
                    })}
                    <div>{browser.i18n.getMessage("options_page_section_timeline_date_range_later")}</div>
                </Stack>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
