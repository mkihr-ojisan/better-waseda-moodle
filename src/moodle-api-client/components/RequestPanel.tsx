import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import React, { FC, useContext } from "react";
import { Endpoint, MoodleAPIClientContext } from "./MoodleAPIClient";
import { usePromise } from "@/common/react/hooks/usePromise";
import { call } from "@/common/util/messenger/client";

export const RequestPanel: FC = () => {
    const context = useContext(MoodleAPIClientContext)!;

    const { value: functions } = usePromise(async () => {
        const siteInfo = await call("core_webservice_get_site_info");
        return siteInfo.functions.map((f) => f.name).sort();
    }, []);

    const handleFindSource = () => {
        let query = "repo:moodle/moodle (";

        const split = context.functionName.split("_");
        switch (split[0]) {
            case "core":
                query += "((path:**/externallib.php OR path:**/external.php) ";
                query += `path:/^${split[1]}\\// `;
                query += split.slice(2).join("_");
                query += `) OR (path:lib/db/services.php ${context.functionName})`;
                break;
            case "mod":
                query += "((path:**/externallib.php OR path:**/external.php) ";
                query += `path:/^mod\\/${split[1]}\\// `;
                query += split.slice(2).join("_");
                query += `) OR (path:lib/db/services.php ${context.functionName})`;
                break;
            default:
                query += "path:lib/db/services.php " + context.functionName;
                break;
        }
        query += ")";
        window.open(`https://github.com/search?q=${encodeURIComponent(query)}`, "_blank");
    };

    const handleFormatArgs = () => {
        try {
            const args = JSON.parse(context.args);
            context.setArgs(JSON.stringify(args, null, 4));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <Stack p={1} gap={1} sx={{ height: "100%" }}>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="endpoint-select-label">Endpoint</InputLabel>
                    <Select
                        labelId="endpoint-select-label"
                        label="Endpoint"
                        value={context.endpoint}
                        onChange={(e) => context.setEndpoint(e.target.value as Endpoint)}
                    >
                        <MenuItem value="webservice">/webservice/rest/server.php</MenuItem>
                        <MenuItem value="ajax">/lib/ajax/service.php</MenuItem>
                    </Select>
                </FormControl>
                <Autocomplete
                    options={functions ?? []}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Function" />}
                    value={context.functionName}
                    onChange={(_, value) => context.setFunctionName(value ?? "")}
                />
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={handleFindSource} disabled={!context.functionName}>
                        find source
                    </Button>
                    <Button variant="outlined" onClick={handleFormatArgs}>
                        format args
                    </Button>
                    <Button variant="outlined" onClick={context.call} disabled={!context.functionName}>
                        call
                    </Button>
                </Stack>
                <TextField
                    fullWidth
                    label="Arguments"
                    multiline
                    maxRows={1}
                    value={context.args}
                    onChange={(e) => context.setArgs(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        "& textarea, & .MuiInputBase-root": {
                            height: "100% !important",
                        },
                    }}
                />
            </Stack>
        </>
    );
};
