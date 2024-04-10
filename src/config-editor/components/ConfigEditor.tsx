import { CONFIG_VALUE_TYPE_DEF, ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import { compressObject } from "@/common/util/object-compression";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import React, { FC, useEffect, useState } from "react";

export const ConfigEditor: FC = () => {
    const configKeys = Object.values(ConfigKey).filter((key): key is ConfigKey => typeof key === "number");

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {configKeys.map((key) => (
                    <Config key={key} configKey={key} />
                ))}
            </TableBody>
        </Table>
    );
};

const Config = (props: { configKey: ConfigKey }) => {
    const [value, setValue] = useConfig(props.configKey);
    const [error, setError] = useState(false);

    const [strValue, setStrValue] = useState(() => JSON.stringify(value, null, 2));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStrValue(e.target.value);

        try {
            const value = JSON.parse(e.target.value);

            // check type
            compressObject(CONFIG_VALUE_TYPE_DEF[props.configKey], value);

            setValue(value);
            setError(false);
        } catch (e) {
            console.error(e);
            setError(true);
        }
    };

    useEffect(() => {
        setStrValue(JSON.stringify(value, null, 2));
    }, [value]);

    return (
        <TableRow>
            <TableCell>{props.configKey}</TableCell>
            <TableCell>{ConfigKey[props.configKey]}</TableCell>
            <TableCell>
                <pre>{JSON.stringify(CONFIG_VALUE_TYPE_DEF[props.configKey], null, 2)}</pre>
            </TableCell>
            <TableCell>
                <TextField
                    value={strValue}
                    onChange={handleChange}
                    error={error}
                    multiline
                    InputProps={{ sx: { fontFamily: "monospace" } }}
                    fullWidth
                />
            </TableCell>
        </TableRow>
    );
};
