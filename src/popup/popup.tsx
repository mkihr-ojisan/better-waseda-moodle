import { initConfig } from "@/common/config/config";
import { createRoot } from "react-dom/client";
import { Popup } from "./components/Popup";
import React from "react";
import { BWMRoot } from "@/common/react/root";
import { NotificationContextProvider } from "@/common/react/notification";

// タブで開いているかどうかを判定
if (browser.extension.getViews({ type: "popup" }).length === 0) {
    document.documentElement.classList.add("tab");
}

(async () => {
    await initConfig();

    const root = createRoot(document.getElementById("container")!);
    root.render(
        <BWMRoot>
            <NotificationContextProvider offset={[0, -48]}>
                <Popup />
            </NotificationContextProvider>
        </BWMRoot>
    );
})();
