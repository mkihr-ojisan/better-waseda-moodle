import { IconButton, ListItemButton, ListItemSecondaryAction, ListItemText } from "@mui/material";
import React, { FC, useContext } from "react";
import { DisableOptionsContext } from "./DisableOptions";
import LaunchIcon from "@mui/icons-material/Launch";

export type LaunchProps = {
    text: string;
    onClick: () => void;
};
export const Launch: FC<LaunchProps> = (props) => {
    const disabled = useContext(DisableOptionsContext);

    return (
        <ListItemButton onClick={props.onClick} disabled={disabled}>
            <ListItemText
                primary={props.text}
                primaryTypographyProps={{ color: disabled ? "text.disabled" : "text.primary" }}
                secondaryTypographyProps={{ color: disabled ? "text.disabled" : "text.secondary" }}
            />
            <ListItemSecondaryAction>
                <IconButton>
                    <LaunchIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItemButton>
    );
};
