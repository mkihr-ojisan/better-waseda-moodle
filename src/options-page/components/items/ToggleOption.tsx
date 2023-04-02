import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import { Box, ListItemButton, ListItemSecondaryAction, ListItemText, Switch, Typography } from "@mui/material";
import React, { FC, HTMLAttributes, useCallback, useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import { DisableOptionsContext } from "./DisableOptions";

export type ConfigToggleOptionProps = {
    configKey: ConfigKey;
    configKeyObjectKey?: string;
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    useMarkdownForDescription?: boolean;
};

export const ConfigToggleOption: FC<ConfigToggleOptionProps> = (props) => {
    const [configValue, setConfigValue] = useConfig(props.configKey);

    const value = useMemo(() => {
        if (props.configKeyObjectKey) {
            if (typeof configValue !== "object") throw Error("`value` must be object.");
            return (configValue as Record<string, unknown>)[props.configKeyObjectKey];
        } else {
            return configValue;
        }
    }, [configValue, props.configKeyObjectKey]);

    const setValue = useCallback(
        (value: boolean) => {
            if (props.configKeyObjectKey) {
                setConfigValue({
                    ...(configValue as Record<string, unknown>),
                    [props.configKeyObjectKey]: value,
                } as any);
            } else {
                setConfigValue(value);
            }
        },
        [configValue, props.configKeyObjectKey, setConfigValue]
    );

    if (typeof value !== "boolean") throw Error("`value` must be boolean.");

    return (
        <ToggleOption
            value={value}
            setValue={setValue}
            message={props.message}
            messageSubstitutions={props.messageSubstitutions}
            description={props.description}
            descriptionSubstitutions={props.descriptionSubstitutions}
            useMarkdownForDescription={props.useMarkdownForDescription}
        />
    );
};

export type ToggleOptionProps = {
    value: boolean;
    setValue: (value: boolean) => void;
    message: string;
    messageSubstitutions?: string | string[];
    description?: string;
    descriptionSubstitutions?: string | string[];
    useMarkdownForDescription?: boolean;
};

export const ToggleOption: FC<ToggleOptionProps> = (props) => {
    const { value, setValue } = props;

    const disabled = useContext(DisableOptionsContext);

    const handleClick = useCallback(() => {
        setValue(!value);
    }, [setValue, value]);

    return (
        <ListItemButton sx={{ paddingRight: "100px" }} onClick={handleClick}>
            <ListItemText
                disableTypography
                primary={
                    <Typography variant="body1" color={disabled ? "text.disabled" : "text.primary"}>
                        {browser.i18n.getMessage(props.message, props.messageSubstitutions)}
                    </Typography>
                }
                secondary={
                    props.description &&
                    (props.useMarkdownForDescription ? (
                        <Markdown>
                            {props.description &&
                                browser.i18n.getMessage(props.description, props.descriptionSubstitutions)}
                        </Markdown>
                    ) : (
                        <Typography variant="body2" color={disabled ? "text.disabled" : "text.secondary"}>
                            {props.description &&
                                browser.i18n.getMessage(props.description, props.descriptionSubstitutions)}
                        </Typography>
                    ))
                }
            />
            <ListItemSecondaryAction>
                <Switch checked={value} onClick={handleClick} disabled={disabled} />
            </ListItemSecondaryAction>
        </ListItemButton>
    );
};

const Markdown = (props: ReactMarkdownOptions) => (
    <ReactMarkdown
        {...props}
        components={{
            a: function A(props: HTMLAttributes<HTMLAnchorElement>) {
                const handleEvent = useCallback((event: React.SyntheticEvent<HTMLAnchorElement>) => {
                    event.stopPropagation();
                }, []);

                return (
                    <Box
                        component="a"
                        {...props}
                        onClick={handleEvent}
                        onTouchStart={handleEvent}
                        target="_blank"
                        sx={{ color: "primary.main" }}
                    />
                );
            },
            p: function P(props: HTMLAttributes<HTMLParagraphElement>) {
                return <Typography variant="body2" color="text.secondary" component="p" {...props} />;
            },
        }}
    />
);
