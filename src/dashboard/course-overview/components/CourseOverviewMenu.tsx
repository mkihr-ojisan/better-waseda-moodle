import MoreVert from "@mui/icons-material/MoreVert";
import { Box, Checkbox, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import Refresh from "@mui/icons-material/Refresh";
import { useCourseOverviewContext } from "./CourseOverview";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { CollectCourseInformationDialog } from "./dialogs/CollectCourseInformationDialog";

export const CourseOverviewMenu: FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const context = useCourseOverviewContext();

    const handleChangeShowHiddenCourses = useCallback(() => {
        context.setShowHiddenCourses(!context.showHiddenCourses);
        handleCloseMenu();
    }, [context, handleCloseMenu]);

    const [collectCourseInformationDialogOpen, setCollectCourseInformationDialogOpen] = useState(false);
    const handleCollectCourseInformation = useCallback(() => {
        setCollectCourseInformationDialogOpen(true);
        handleCloseMenu();
    }, [handleCloseMenu]);
    const handleCloseCollectCourseInformationDialog = useCallback(() => {
        setCollectCourseInformationDialogOpen(false);
    }, []);

    return (
        <>
            <IconButton size="large" onClick={handleOpenMenu}>
                <MoreVert />
            </IconButton>

            <Menu
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Box ml={4}></Box>
                <MenuItem onClick={handleChangeShowHiddenCourses}>
                    <ListItemIcon>
                        <Checkbox checked={context.showHiddenCourses} id="show-hidden-courses" sx={{ padding: 0 }} />
                    </ListItemIcon>
                    <ListItemText>{browser.i18n.getMessage("course_overview_show_hidden_courses")}</ListItemText>
                </MenuItem>
                <MenuItem onClick={context.reloadCourses}>
                    <ListItemIcon>
                        <Refresh />
                    </ListItemIcon>
                    <ListItemText>{browser.i18n.getMessage("course_overview_reload_courses")}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleCollectCourseInformation}>
                    <ListItemIcon>
                        <AutoAwesome />
                    </ListItemIcon>
                    <ListItemText>{browser.i18n.getMessage("course_overview_collect_course_information")}</ListItemText>
                </MenuItem>
            </Menu>

            <CollectCourseInformationDialog
                open={collectCourseInformationDialogOpen}
                onClose={handleCloseCollectCourseInformationDialog}
            />
        </>
    );
};
