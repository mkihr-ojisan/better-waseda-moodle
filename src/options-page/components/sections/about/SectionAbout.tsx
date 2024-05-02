import { Box, ButtonBase, Divider, List, Typography } from "@mui/material";
import { OptionsPageSection } from "../../OptionsPage";
import InfoIcon from "@mui/icons-material/Info";
import React, { useState } from "react";
import { Link } from "../../items/Link";
import { useNotify } from "@/common/react/notification";
import { DevModeOnly } from "../../items/DevMode";
import { Launch } from "../../items/Launch";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";
import { StorageUsage } from "./StorageUsage";

export default {
    id: "about",
    title: "options_page_section_about_title",
    Icon: InfoIcon,
    Component: () => {
        const notify = useNotify();

        const [, setDevMode] = useConfig(ConfigKey.DevMode);
        const [clickCount, setClickCount] = useState(0);
        const handleClickVersion = () => {
            setClickCount(clickCount + 1);
            if (clickCount === 10) {
                setDevMode(true);
                notify({ message: "Dev mode enabled.", type: "info" });
            }
        };

        return (
            <Box sx={{ textAlign: "center" }}>
                <Box py={3}>
                    <img src="/res/images/icon.svg" width="128" />
                </Box>
                <Box pb={3}>
                    <Typography variant="h6">{browser.i18n.getMessage("extension_name")}</Typography>
                    <ButtonBase sx={{ padding: 0, color: "text.secondary" }} onClick={handleClickVersion}>
                        {browser.i18n.getMessage("version", browser.runtime.getManifest().version)}
                    </ButtonBase>
                </Box>
                <Box pb={3} px={3}>
                    <Typography variant="body2" color="text.secondary" component="div" sx={{ textAlign: "initial" }}>
                        {browser.i18n.getMessage("options_page_section_about_disclaimer")}
                    </Typography>
                </Box>
                <Box pb={3}>
                    <List>
                        <Divider />
                        <Link
                            message="options_page_section_about_source_code"
                            href="https://github.com/mkihr-ojisan/better-waseda-moodle"
                        />
                        <Divider />

                        <DevModeOnly>
                            <Launch text="Turn off Dev Mode" onClick={() => setDevMode(false)} />
                            <Divider />
                            <Launch
                                text="Moodle API Client"
                                onClick={() =>
                                    window.open(browser.runtime.getURL("/moodle-api-client/moodle-api-client.html"))
                                }
                            />
                            <Divider />
                            <Launch
                                text="Config Editor"
                                onClick={() => window.open(browser.runtime.getURL("/config-editor/config-editor.html"))}
                            />
                            <Divider />
                            <Launch
                                text="Reset Config"
                                onClick={() => {
                                    if (confirm("Reset all config values?")) {
                                        browser.storage.sync.clear();
                                        browser.runtime.reload();
                                    }
                                }}
                            />
                            <Divider />
                            <StorageUsage />
                        </DevModeOnly>
                    </List>
                </Box>
            </Box>
        );
    },
    divider: true,
} satisfies OptionsPageSection;
