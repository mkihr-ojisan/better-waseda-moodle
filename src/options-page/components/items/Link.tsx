import { IconButton, ListItemButton, ListItemSecondaryAction, ListItemText } from "@mui/material";
import React, { FC, useContext } from "react";
import { DisableOptionsContext } from "./DisableOptions";
import LaunchIcon from "@mui/icons-material/Launch";

export type LinkProps = {
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    href: string;
};
export const Link: FC<LinkProps> = (props) => {
    const disabled = useContext(DisableOptionsContext);

    return (
        <ListItemButton onClick={() => window.open(props.href, "_blank")} disabled={disabled}>
            <ListItemText
                primary={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                secondary={
                    props.description && browser.i18n.getMessage(props.description, props.descriptionSubstitutions)
                }
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
