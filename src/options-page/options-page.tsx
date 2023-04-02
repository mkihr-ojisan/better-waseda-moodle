import { assertExtensionContext } from "@/common/util/context";
import React from "react";
import { createRoot } from "react-dom/client";
import { BWMRoot } from "@/common/react/root";
import { OptionsPage } from "./components/OptionsPage";
import { initConfig } from "@/common/config/config";

assertExtensionContext("extension_page");

document.title = browser.i18n.getMessage("options_page_title");

initConfig().then(() => {
    createRoot(document.getElementById("root")!).render(
        <BWMRoot>
            <OptionsPage />
        </BWMRoot>
    );
});
