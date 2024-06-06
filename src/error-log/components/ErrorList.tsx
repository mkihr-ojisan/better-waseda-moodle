import { ErrorLogEntry } from "@/common/error-log";
import { Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";

export type ErrorListProps = {
    errors: ErrorLogEntry[];
};

export const ErrorList: React.FC<ErrorListProps> = (props) => {
    const sortedErrors = useMemo(() => [...props.errors].sort((a, b) => b.timestamp - a.timestamp), [props.errors]);

    return (
        <Stack gap={2}>
            {sortedErrors.map((error, index) => (
                <div key={index}>
                    <Typography variant="h6">
                        {error.name && `${error.name}: `}
                        {error.message}
                    </Typography>
                    <Typography variant="body1">timestamp: {new Date(error.timestamp).toLocaleString()}</Typography>
                    <Typography variant="body1">page: {error.page}</Typography>
                    <Typography variant="body1">
                        source: {error.filename}:{error.lineno}:{error.colno}
                    </Typography>
                    <details>
                        <summary>stacktrace</summary>
                        <pre>{error.stack}</pre>
                    </details>
                </div>
            ))}
        </Stack>
    );
};
