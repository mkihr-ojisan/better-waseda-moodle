import { CourseWithSetHidden } from "@/common/course/course";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import LaunchIcon from "@mui/icons-material/Launch";
import { getURLFromKey } from "@/common/api/waseda/syllabus";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CourseSettingsDialog } from "./dialogs/course-settings/CourseSettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNotify } from "@/common/react/notification";

export type CourseCardMenuProps = {
    course: CourseWithSetHidden;
    inTimetable?: boolean;
    anchorEl?: HTMLElement | null;
    anchorReference?: "anchorEl" | "anchorPosition" | "none";
    anchorPosition?: { top: number; left: number };
    open: boolean;
    onClose: () => void;
};

export const CourseCardMenu: FC<CourseCardMenuProps> = (props) => {
    const notify = useNotify();

    const syllabusKey = useConfig(ConfigKey.CourseSyllabusKeys)[0][props.course.id];

    const handleOpenSyllabus = useCallback(() => {
        if (!syllabusKey) return;
        window.open(getURLFromKey(syllabusKey), "_blank");
        props.onClose();
    }, [syllabusKey, props]);

    const [courseSettingsDialogOpen, setCourseSettingsDialogOpen] = useState(false);
    const handleOpenCourseSettingsDialog = useCallback(() => {
        setCourseSettingsDialogOpen(true);
        props.onClose();
    }, [props]);
    const handleCloseCourseSettingsDialog = useCallback(() => {
        setCourseSettingsDialogOpen(false);
    }, []);

    const handleHideCourse = useCallback(() => {
        props.course.setHidden(true);
        props.onClose();
        if (!getConfig(ConfigKey.HiddenTips).includes("hide_course")) {
            notify({
                type: "info",
                message: browser.i18n.getMessage("course_overview_hide_course_message"),
                action: browser.i18n.getMessage("hide_tip_long"),
                onAction: () => {
                    setConfig(ConfigKey.HiddenTips, [...getConfig(ConfigKey.HiddenTips), "hide_course"]);
                },
                closeOnAction: true,
            });
        }
    }, [notify, props]);
    const handleUnhideCourse = useCallback(() => {
        props.course.setHidden(false);
        props.onClose();
    }, [props]);

    return (
        <>
            <Menu
                open={props.open}
                onClose={props.onClose}
                anchorEl={props.anchorEl}
                anchorReference={props.anchorReference}
                anchorPosition={props.anchorPosition}
            >
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
