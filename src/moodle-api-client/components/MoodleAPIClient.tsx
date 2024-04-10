import React, { FC, createContext, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import * as styles from "./MoodleAPIClient.module.css";
import { RequestPanel } from "./RequestPanel";
import { call } from "@/common/util/messenger/client";
import { ResponsePanel } from "./ResponsePanel";
import { useNotify } from "@/common/react/notification";

export type MoodleAPIClientContextValue = {
    endpoint: Endpoint;
    setEndpoint: (endpoint: Endpoint) => void;
    functionName: string;
    setFunctionName: (func: string) => void;
    args: string;
    setArgs: (args: string) => void;
    call: () => void;
    result: unknown;
    error: unknown;
};

export type Endpoint = "webservice" | "ajax";

export const MoodleAPIClientContext = createContext<MoodleAPIClientContextValue | null>(null);

export const MoodleAPIClient: FC = () => {
    const notify = useNotify();

    const [endpoint, setEndpoint] = useState<Endpoint>("webservice");
    const [functionName, setFunctionName] = useState<string>("");
    const [args, setArgs] = useState<string>("{\n\n}");
    const [result, setResult] = useState<unknown>(null);
    const [error, setError] = useState<unknown>(null);

    const handleCall = async () => {
        setResult(null);
        setError(null);

        try {
            let result;
            switch (endpoint) {
                case "ajax":
                    result = (await call("callMoodleAPI", [{ methodname: functionName, args: JSON.parse(args) }]))[0]
                        .data;
                    break;
                case "webservice":
                    result = await call("callMoodleMobileAPI", { methodname: functionName, args: JSON.parse(args) });
                    break;
            }
            setResult(result);
        } catch (e) {
            setError(e);
        }
    };

    const context: MoodleAPIClientContextValue = {
        endpoint,
        setEndpoint,
        functionName,
        setFunctionName,
        args,
        setArgs,
        call: handleCall,
        result,
        error,
    };

    // 選択されたテキストが日付っぽい場合はその日付を通知する
    useEffect(() => {
        const listener = () => {
            const selection = document.getSelection()?.toString() ?? "";
            const num = parseInt(selection);
            if (isNaN(num)) return;
            const date = new Date(num * 1000);
            if (date.getFullYear() > 2000 && date.getFullYear() < 3000) {
                notify({ message: date.toLocaleString(), type: "info" });
            }
        };

        document.addEventListener("selectionchange", listener);

        return () => {
            document.removeEventListener("selectionchange", listener);
        };
    }, [notify]);

    return (
        <MoodleAPIClientContext.Provider value={context}>
            <PanelGroup direction="horizontal">
                <Panel>
                    <RequestPanel />
                </Panel>
                <PanelResizeHandle className={styles.resizeHandle} />
                <Panel>
                    <ResponsePanel />
                </Panel>
            </PanelGroup>
        </MoodleAPIClientContext.Provider>
    );
};
