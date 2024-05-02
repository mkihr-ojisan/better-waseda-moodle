import React, { FC } from "react";
import { ToggleOption } from "../../items/ToggleOption";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";
import { ListItem, ListItemText, TextField, Typography } from "@mui/material";

export const OptionTimelineDateBorderOffset: FC = () => {
    // 値はミリ秒単位、無効時は0
    const [dateBorderOffset, setDateBorderOffset] = useConfig(ConfigKey.TimelineDateBorderOffset);

    const disabled = dateBorderOffset === 0;
    const color = disabled ? "text.disabled" : "text.primary";

    return (
        <>
            <ToggleOption
                message="options_page_section_timeline_date_border_offset"
                description="options_page_section_timeline_date_border_offset_description"
                value={!disabled}
                setValue={(value) => setDateBorderOffset(value ? 1 : 0)}
            />
            <ListItem sx={{ flexWrap: "wrap" }}>
                <ListItemText
                    primary={browser.i18n.getMessage("options_page_section_timeline_date_border_offset_value")}
                    primaryTypographyProps={{ color }}
                />
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <TextField
                        value={disabled ? 0 : (dateBorderOffset - 1) / (60 * 60 * 1000)}
                        onChange={(event) => {
                            const hours = parseInt(event.target.value);
                            if (isNaN(hours)) return;
                            setDateBorderOffset(hours * 60 * 60 * 1000 + 1);
                        }}
                        disabled={disabled}
                        type="number"
                        variant="standard"
                        inputProps={{ min: 0, max: 23 }}
                        sx={{ width: "100px" }}
                    />
                    <Typography variant="body1" color={color}>
                        {browser.i18n.getMessage("options_page_section_timeline_date_border_offset_hours")}
                    </Typography>
                </div>
            </ListItem>
        </>
    );
};
