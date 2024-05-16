import { Autocomplete, IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import React, { FC } from "react";
import ReplayIcon from "@mui/icons-material/Replay";

export type ColorPickerProps = {
    value: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    textFieldProps?: TextFieldProps;
};

const colorPalette = [
    "#f44e3b",
    "#fe9200",
    "#fcdc00",
    "#dbdf00",
    "#a4dd00",
    "#68ccca",
    "#73d8ff",
    "#aea1ff",
    "#fda1ff",
    "#d33115",
    "#e27300",
    "#fcc400",
    "#b0bc00",
    "#68bc00",
    "#16a5a5",
    "#009ce0",
    "#7b64ff",
    "#fa28ff",
    "#9f0500",
    "#c45100",
    "#fb9e00",
    "#808900",
    "#194d33",
    "#0c797d",
    "#0062b1",
    "#653294",
    "#ab149e",
    "#000000",
    "#333333",
    "#4d4d4d",
    "#666666",
    "#808080",
    "#999999",
    "#b3b3b3",
    "#cccccc",
    "#ffffff",
];

export const ColorPicker: FC<ColorPickerProps> = (props) => {
    return (
        <Autocomplete
            freeSolo
            autoSelect
            options={colorPalette}
            disableClearable
            renderInput={(params) => (
                <TextField
                    {...params}
                    {...props.textFieldProps}
                    InputProps={{
                        ...params.InputProps,
                        ...props.textFieldProps?.InputProps,
                        startAdornment: (
                            <InputAdornment
                                position="start"
                                component="div"
                                style={{
                                    backgroundColor: props.value as string,
                                    margin: "0 8px",
                                    width: "1.5em",
                                    height: "1.5em",
                                }}
                            />
                        ),
                        endAdornment: props.defaultValue ? (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => props.onChange?.(props.defaultValue!)}
                                    title={browser.i18n.getMessage("set_default")}
                                >
                                    <ReplayIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : undefined,
                    }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option}>
                    <div
                        style={{
                            backgroundColor: option,
                            margin: "0 8px",
                            width: "1.5em",
                            height: "1.5em",
                        }}
                    />
                    <div>{option}</div>
                </li>
            )}
            value={props.value}
            onChange={(_, value) => props.onChange?.(value)}
        />
    );
};
