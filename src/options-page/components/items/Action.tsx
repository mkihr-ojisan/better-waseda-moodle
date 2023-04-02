import { Button, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import React, { FC, useContext } from "react";
import { DisableOptionsContext } from "./DisableOptions";

export type ActionProps = {
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    buttonMessage: string;
    buttonMessageSubstitutions?: string | string[];
    onClick: () => void;
};
export const Action: FC<ActionProps> = (props) => {
    const disabled = useContext(DisableOptionsContext);

    return (
        <ListItem sx={{ paddingRight: "160px" }}>
            <ListItemText
                primary={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                secondary={
                    props.description && browser.i18n.getMessage(props.description, props.descriptionSubstitutions)
                }
                primaryTypographyProps={{ color: disabled ? "text.disabled" : "text.primary" }}
                secondaryTypographyProps={{ color: disabled ? "text.disabled" : "text.secondary" }}
            />
            <ListItemSecondaryAction>
                <Button variant="outlined" onClick={props.onClick} disabled={disabled}>
                    {browser.i18n.getMessage(props.buttonMessage, props.buttonMessageSubstitutions)}
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
