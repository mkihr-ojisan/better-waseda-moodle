import { Box, Divider, List, Typography } from "@mui/material";
import { OptionsPageSection } from "../../OptionsPage";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";
import { Link } from "../../items/Link";

export default {
    id: "about",
    title: "options_page_section_about_title",
    Icon: InfoIcon,
    Component: () => {
        return (
            <Box sx={{ textAlign: "center" }}>
                <Box py={3}>
                    <img src="/res/images/icon.svg" width="128" />
                </Box>
                <Box pb={3}>
                    <Typography variant="h6">{browser.i18n.getMessage("extension_name")}</Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                        {browser.i18n.getMessage("version", browser.runtime.getManifest().version)}
                    </Typography>
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
