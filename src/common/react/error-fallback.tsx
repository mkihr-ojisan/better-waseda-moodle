import { Alert, AlertTitle } from "@mui/material";
import React, { FC } from "react";

export const ErrorFallback: FC<{ error: any }> = ({ error }) => {
    return (
        <Alert severity="error" variant="outlined">
            <AlertTitle>{browser.i18n.getMessage("error_message")}</AlertTitle>
            {error instanceof Error ? error.message : String(error)}
        </Alert>
    );
};
