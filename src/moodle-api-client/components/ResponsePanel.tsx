import React, { FC, useContext, useMemo, useState } from "react";
import { MoodleAPIClientContext } from "./MoodleAPIClient";
import { Alert, AlertTitle, Button, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import "react18-json-view/src/dark.css";
import { useTheme } from "@mui/material/styles";

export const ResponsePanel: FC = () => {
    const context = useContext(MoodleAPIClientContext)!;
    const theme = useTheme();

    const [query, setQuery] = useState(".");
    const [raw, setRaw] = useState(false);

    const filtered = useMemo(() => {
        return filter(context.result, parseQuery(query));
    }, [context.result, query]);

    return (
        <Stack p={1} sx={{ overflow: "scroll", width: "100%", height: "100%" }}>
            <TextField
                label="Query"
                fullWidth
                margin="dense"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <FormControlLabel
                control={<Switch checked={raw} onChange={(e) => setRaw(e.target.checked)} />}
                label="Raw"
            />

            {context.result ? (
                <>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                window.navigator.clipboard.writeText(JSON.stringify(filtered, null, 4));
                            }}
                        >
                            Copy
                        </Button>
                    </Stack>

                    {raw ? (
                        typeof filtered === "string" ? (
                            <pre>{filtered}</pre>
                        ) : (
                            <pre>{JSON.stringify(filtered, null, 4)}</pre>
                        )
                    ) : (
                        <JsonView src={filtered} dark={theme.palette.mode === "dark"} />
                    )}
                </>
            ) : null}

            {context.error ? (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {String(context.error)}
                </Alert>
            ) : null}
        </Stack>
    );
};

/**
 * queryをパースする
 *
 * @param query - "key1.key2[0].key3"
 * @returns ["key1", "key2", "[0]", "key3"]
 */
function parseQuery(query: string): string[] {
    if (query[0] === ".") {
        query = query.substring(1);
    }

    const result: string[] = [];
    let current = "";
    let inBracket = false;

    for (const c of query) {
        if (c === ".") {
            if (inBracket) {
                current += c;
            } else {
                result.push(current);
                current = "";
            }
        } else if (c === "[") {
            if (current !== "") {
                result.push(current);
            }
            inBracket = true;
            current = c;
        } else if (c === "]") {
            result.push(current + c);
            current = "";
            inBracket = false;
        } else {
            current += c;
        }
    }

    result.push(current);

    return result;
}

/**
 * jq風
 *
 * @param obj - 対象のオブジェクト
 * @param query - ["key1", "key2", "[0]", "key3"]みたいな
 * @returns 結果
 */
function filter(obj: any, query: string[]): any {
    if (query.length === 0) {
        return obj;
    }

    const [head, ...tail] = query;

    if (head === "") return filter(obj, tail);

    if (typeof obj === "object") {
        if (obj === null) return undefined;

        if (obj instanceof Array) {
            if (head === "[]") {
                return obj.map((o) => filter(o, tail));
            } else {
                const index = parseInt(head.substring(1, head.length - 1), 10);
                return filter(obj[index], tail);
            }
        } else {
            return filter(obj[head], tail);
        }
    } else {
        return undefined;
    }
}
