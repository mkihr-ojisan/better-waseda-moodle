import { BWMRoot } from "@/common/react/root";
import { createRoot } from "react-dom/client";
import React from "react";
import { ErrorLog } from "./components/ErrorLog";
import { initConfig } from "@/common/config/config";

(async () => {
    await initConfig();

    createRoot(document.getElementById("root")!).render(
        <BWMRoot>
            <ErrorLog />
        </BWMRoot>
    );
})();
