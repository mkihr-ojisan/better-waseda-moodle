import { Box, ButtonBase, Divider, List, Typography } from "@mui/material";
import { OptionsPageSection, useOptionsPageContext } from "../../OptionsPage";
import InfoIcon from "@mui/icons-material/Info";
import React, { useState } from "react";
import { Link } from "../../items/Link";
import { useNotify } from "@/common/react/notification";

export default {
    id: "about",
    title: "options_page_section_about_title",
    Icon: InfoIcon,
    Component: () => {
        const context = useOptionsPageContext();
        const notify = useNotify();

        const [clickCount, setClickCount] = useState(0);
        const handleClickVersion = () => {
            setClickCount(clickCount + 1);
            if (clickCount === 10 && !context.devMode) {
                context.setDevMode(true);
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
                    </List>
                </Box>
            </Box>
        );
    },
    divider: true,
} satisfies OptionsPageSection;
