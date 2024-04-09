import { BWMRoot } from "@/common/react/root";
import React from "react";
import { createRoot } from "react-dom/client";
import { AddToTimetableButton } from "./components/AddToTimetableButton";
import { initConfig } from "@/common/config/config";

(async () => {
    await initConfig();

    const elem = document.getElementById("cHonbun");
    if (!elem) return;

    const root = document.createElement("div");
    root.style.textAlign = "right";
    elem.insertAdjacentElement("afterbegin", root);

    createRoot(root).render(
        <BWMRoot>
            <AddToTimetableButton />
        </BWMRoot>
    );
})();
