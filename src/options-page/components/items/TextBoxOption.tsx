import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import { ListItem, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material";
import React, { FC, useCallback, useContext } from "react";
import { DisableOptionsContext } from "./DisableOptions";

export type ConfigTextBoxOptionProps = {
    configKey: ConfigKey;
    inputType?: string;
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    placeholderMessage?: string;
    placeholderMessageSubstitutions?: string | string[];
    textBoxWidth?: string;
};

export const ConfigTextBoxOption: FC<ConfigTextBoxOptionProps> = (props) => {
    const [value, setValue] = useConfig(props.configKey);
    if (typeof value !== "string") throw Error("`value` must be string.");

    return (
        <TextBoxOption
            value={value}
            setValue={setValue}
            message={props.message}
            messageSubstitutions={props.messageSubstitutions}
            description={props.description}
            descriptionSubstitutions={props.descriptionSubstitutions}
            placeholderMessage={props.placeholderMessage}
            placeholderMessageSubstitutions={props.placeholderMessageSubstitutions}
            textBoxWidth={props.textBoxWidth}
        />
    );
};

export type TextBoxOptionProps = {
    value: string;
    setValue: (value: string) => void;
    inputType?: string;
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    placeholderMessage?: string;
    placeholderMessageSubstitutions?: string | string[];
    textBoxWidth?: string;
};

export const TextBoxOption: FC<TextBoxOptionProps> = (props) => {
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            props.setValue(event.target.value);
        },
        [props]
    );

    const disabled = useContext(DisableOptionsContext);

    return (
        <ListItem sx={{ paddingRight: "250px" }}>
            <ListItemText
                primary={browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                secondary={
                    props.description && browser.i18n.getMessage(props.description, props.descriptionSubstitutions)
                }
                primaryTypographyProps={{ color: disabled ? "text.disabled" : "text.primary" }}
                secondaryTypographyProps={{ color: disabled ? "text.disabled" : "text.secondary" }}
            />
            <ListItemSecondaryAction>
                <TextField
                    value={props.value}
                    onChange={handleChange}
                    disabled={disabled}
                    type={props.inputType}
                    placeholder={
                        props.placeholderMessage &&
                        browser.i18n.getMessage(props.placeholderMessage, props.placeholderMessageSubstitutions)
                    }
                    variant="standard"
                    sx={{ width: props.textBoxWidth ?? "250px" }}
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
};
