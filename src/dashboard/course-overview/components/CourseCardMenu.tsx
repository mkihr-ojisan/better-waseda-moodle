import { CourseWithSetHidden } from "@/common/course/course";
import MoreVert from "@mui/icons-material/MoreVert";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey } from "@/common/config/config";
import LaunchIcon from "@mui/icons-material/Launch";
import { getURLFromKey } from "@/common/api/waseda/syllabus";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CourseSettingsDialog } from "./dialogs/course-settings/CourseSettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";

export type CourseCardMenuProps = {
    course: CourseWithSetHidden;
};

export const CourseCardMenu: FC<CourseCardMenuProps> = (props) => {
    const syllabusKey = useConfig(ConfigKey.CourseSyllabusKeys)[0][props.course.id];

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleOpenSyllabus = useCallback(() => {
        if (!syllabusKey) return;
        window.open(getURLFromKey(syllabusKey), "_blank");
        handleCloseMenu();
    }, [syllabusKey, handleCloseMenu]);

    const [courseSettingsDialogOpen, setCourseSettingsDialogOpen] = useState(false);
    const handleOpenCourseSettingsDialog = useCallback(() => {
        setCourseSettingsDialogOpen(true);
        handleCloseMenu();
    }, [handleCloseMenu]);
    const handleCloseCourseSettingsDialog = useCallback(() => {
        setCourseSettingsDialogOpen(false);
    }, []);

    const handleHideCourse = useCallback(() => {
        props.course.setHidden(true);
        handleCloseMenu();
    }, [props.course, handleCloseMenu]);
    const handleUnhideCourse = useCallback(() => {
        props.course.setHidden(false);
        handleCloseMenu();
    }, [props.course, handleCloseMenu]);

    return (
        <>
            <IconButton size="small" onClick={handleOpenMenu}>
                <MoreVert fontSize="small" />
            </IconButton>

            <Menu open={Boolean(anchorEl)} onClose={handleCloseMenu} anchorEl={anchorEl}>
                {syllabusKey && (
                    <MenuItem onClick={handleOpenSyllabus}>
                        <ListItemIcon>
                            <LaunchIcon />
                        </ListItemIcon>
                        <ListItemText>{browser.i18n.getMessage("course_overview_open_syllabus")}</ListItemText>
                    </MenuItem>
                )}
                {props.course.hidden ? (
                    <MenuItem onClick={handleUnhideCourse}>
                        <ListItemIcon>
                            <VisibilityIcon />
                        </ListItemIcon>
                        <ListItemText>{browser.i18n.getMessage("course_overview_unhide_course")}</ListItemText>
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleHideCourse}>
                        <ListItemIcon>
                            <VisibilityOffIcon />
                        </ListItemIcon>
                        <ListItemText>{browser.i18n.getMessage("course_overview_hide_course")}</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={handleOpenCourseSettingsDialog}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText>{browser.i18n.getMessage("course_overview_course_settings")}</ListItemText>
                </MenuItem>
            </Menu>

            <CourseSettingsDialog
                open={courseSettingsDialogOpen}
                onClose={handleCloseCourseSettingsDialog}
                course={props.course}
            />
        </>
    );
};
