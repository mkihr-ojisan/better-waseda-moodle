import { clearErrorLog, getErrorLog } from "@/common/error-log";
import { usePromise } from "@/common/react/hooks/usePromise";
import React, { useEffect, useState } from "react";
import { ErrorList } from "./ErrorList";
import { Button, Stack } from "@mui/material";

export const ErrorLog: React.FC = () => {
    const [update, setUpdate] = useState(0);
    const { value: errors } = usePromise(getErrorLog, [update]);

    useEffect(() => {
        const listener = (changes: { [key: string]: browser.storage.StorageChange }, areaName: string) => {
            if (areaName === "local" && changes.errors) {
                setUpdate((prev) => prev + 1);
            }
        };

        browser.storage.onChanged.addListener(listener);

        return () => {
            browser.storage.onChanged.removeListener(listener);
        };
    }, []);

    const handleExport = async () => {
        const errors = await getErrorLog();
        const blob = new Blob([JSON.stringify(errors, null, 4)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "error-log.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: 8 }}>
            <Stack direction="row" gap={1}>
                <Button variant="outlined" onClick={handleExport}>
                    Export as JSON
                </Button>
                <Button variant="outlined" onClick={clearErrorLog}>
                    Clear
                </Button>
            </Stack>

            {errors ? <ErrorList errors={errors} /> : "Loading..."}
        </div>
    );
};
