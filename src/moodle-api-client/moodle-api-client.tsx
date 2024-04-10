import { BWMRoot } from "@/common/react/root";
import { createRoot } from "react-dom/client";
import { MoodleAPIClient } from "./components/MoodleAPIClient";
import React from "react";
import { NotificationContextProvider } from "@/common/react/notification";

createRoot(document.getElementById("root")!).render(
    <BWMRoot>
        <NotificationContextProvider>
            <MoodleAPIClient />
        </NotificationContextProvider>
    </BWMRoot>
);
