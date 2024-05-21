import React, { useState } from "react";
import { OptionsPageSection } from "../../OptionsPage";
import AppsIcon from "@mui/icons-material/Apps";
import { Divider, List } from "@mui/material";
import { ConfigToggleOption } from "../../items/ToggleOption";
import { ConfigKey, setConfig } from "@/common/config/config";
import { ConfigDisableOptions } from "../../items/DisableOptions";
import { Action } from "../../items/Action";
import { call } from "@/common/util/messenger/client";
import { useNotify } from "@/common/react/notification";
import { CollectCourseInformationDialog } from "@/dashboard/course-overview/components/dialogs/CollectCourseInformationDialog";
import { Confirm } from "@/common/react/Confirm";

export default {
    id: "course-overview",
    title: "options_page_section_course_overview_title",
    Icon: AppsIcon,
    Component: () => {
        const notify = useNotify();

        const handleClearCourseListCache = async () => {
            await call("invalidateCourseCache");
            notify({
                message: browser.i18n.getMessage(
                    "options_page_section_course_overview_clear_course_list_cache_success"
                ),
                type: "success",
            });
        };

        const [collectCourseInformationDialogOpen, setCollectCourseInformationDialogOpen] = useState(false);
        const handleOpenCollectCourseInformationDialog = () => {
            setCollectCourseInformationDialogOpen(true);
        };
        const handleCloseCollectCourseInformationDialog = () => {
            setCollectCourseInformationDialogOpen(false);
        };

        const [confirmClearTimetableDataDialogOpen, setConfirmClearTimetableDataDialogOpen] = useState(false);
        const handleOpenConfirmClearTimetableDataDialog = () => {
            setConfirmClearTimetableDataDialogOpen(true);
        };
        const handleCloseConfirmClearTimetableDataDialog = () => {
            setConfirmClearTimetableDataDialogOpen(false);
        };
        const handleClearTimetableData = async () => {
            await setConfig(ConfigKey.TimetableData, {});
            notify({
                message: browser.i18n.getMessage("options_page_section_course_overview_clear_timetable_data_success"),
                type: "success",
            });
        };

        return (
            <List disablePadding>
                <ConfigToggleOption
                    configKey={ConfigKey.CourseOverviewEnabled}
                    message="options_page_section_course_overview_enabled"
                    description="options_page_section_course_overview_enabled_description"
                />
                <Divider />
                <ConfigDisableOptions configKey={ConfigKey.CourseOverviewEnabled}>
                    <Action
                        message="options_page_section_course_overview_clear_course_list_cache"
                        description="options_page_section_course_overview_clear_course_list_cache_description"
                        buttonMessage="options_page_section_course_overview_clear_course_list_cache_button"
                        onClick={handleClearCourseListCache}
                    />
                    <Action
                        message="options_page_section_course_overview_collect_course_information"
                        description="collect_syllabus_information_dialog_description"
                        buttonMessage="options_page_section_course_overview_collect_course_information_button"
                        onClick={handleOpenCollectCourseInformationDialog}
                    />
                    <Action
                        message="options_page_section_course_overview_clear_timetable_data"
                        buttonMessage="options_page_section_course_overview_clear_timetable_data_button"
                        onClick={handleOpenConfirmClearTimetableDataDialog}
                    />
                    <Divider />
                    <ConfigToggleOption
                        configKey={ConfigKey.CourseOverviewAppearanceOptions}
                        configKeyObjectKey="emphasizeCurrentDayAndPeriod"
                        message="options_page_section_course_overview_emphasize_current_day_and_period"
                    />
                    <ConfigToggleOption
                        configKey={ConfigKey.CourseOverviewAppearanceOptions}
                        configKeyObjectKey="showPeriodTime"
                        message="options_page_section_course_overview_show_period_time"
                    />
                    <ConfigToggleOption
                        configKey={ConfigKey.CourseOverviewAppearanceOptions}
                        configKeyObjectKey="showCourseDeliveryMethod"
                        message="options_page_section_course_overview_show_course_delivery_method"
                    />
                    <ConfigToggleOption
                        configKey={ConfigKey.CourseOverviewAppearanceOptions}
                        configKeyObjectKey="showCourseColor"
                        message="options_page_section_course_overview_show_course_color"
                    />
                    <ConfigToggleOption
                        configKey={ConfigKey.CourseOverviewAppearanceOptions}
                        configKeyObjectKey="showCourseNote"
                        message="options_page_section_course_overview_show_note"
                    />
                    <ConfigToggleOption
                        configKey={ConfigKey.CourseOverviewAppearanceOptions}
                        configKeyObjectKey="showCourseMenu"
                        message="options_page_section_course_overview_show_menu"
                    />
                    <Divider />
                    <ConfigToggleOption
                        configKey={ConfigKey.MergeCustomCourses}
                        message="options_page_section_course_overview_merge_custom_courses"
                        description="options_page_section_course_overview_merge_custom_courses_description"
                    />
                    <Divider />
                    <ConfigToggleOption
                        configKey={ConfigKey.HideTabsBeforeEnrollment}
                        message="options_page_section_course_overview_hide_tabs_before_enrollment"
                        description="options_page_section_course_overview_hide_tabs_before_enrollment_description"
                    />
                </ConfigDisableOptions>

                <CollectCourseInformationDialog
                    open={collectCourseInformationDialogOpen}
                    onClose={handleCloseCollectCourseInformationDialog}
                />
                <Confirm
                    open={confirmClearTimetableDataDialogOpen}
                    onClose={handleCloseConfirmClearTimetableDataDialog}
                    onOk={handleClearTimetableData}
                    message={browser.i18n.getMessage(
                        "options_page_section_course_overview_clear_timetable_data_confirm_message"
                    )}
                />
            </List>
        );
    },
} satisfies OptionsPageSection;
