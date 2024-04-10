import { BWMRoot } from "@/common/react/root";
import { createRoot } from "react-dom/client";
import React from "react";
import { ConfigEditor } from "./components/ConfigEditor";
import { initConfig } from "@/common/config/config";

(async () => {
    await initConfig();

    createRoot(document.getElementById("root")!).render(
        <BWMRoot>
            <ConfigEditor />
        </BWMRoot>
    );
})();
