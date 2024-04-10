import { BWMRoot } from "@/common/react/root";
import { createRoot } from "react-dom/client";
import { MoodleAPIClient } from "./components/MoodleAPIClient";
import React from "react";

createRoot(document.getElementById("root")!).render(
    <BWMRoot>
        <MoodleAPIClient />
    </BWMRoot>
);
