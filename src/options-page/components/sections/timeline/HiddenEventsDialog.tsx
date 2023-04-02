import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import { Center } from "@/common/react/Center";
import { CenteredCircularProgress } from "@/common/react/CenteredCircularProgress";
import { useAsyncGenerator } from "@/common/react/hooks/useAsyncGenerator";
import { useNotifyError } from "@/common/react/notification";
import { call } from "@/common/util/messenger/client";
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { FC, Fragment, PropsWithChildren, useState } from "react";

export type HiddenEventsDialogProps = {
    open: boolean;
    onClose: () => void;
};

export const HiddenEventsDialog: FC<HiddenEventsDialogProps> = (props) => {
    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
            {props.open && <HiddenEventsDialogContent />}
        </Dialog>
    );
};

const HiddenEventsDialogContent: FC = () => {
    const [selectedTab, setSelectedTab] = useState<"event_ids" | "courses" | "module_names">("event_ids");

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: "event_ids" | "courses" | "module_names") => {
        setSelectedTab(newValue);
    };

    return (
        <>
            <DialogTitle>
                {browser.i18n.getMessage("options_page_section_timeline_hidden_events_dialog_title")}
            </DialogTitle>
            <DialogContent>
                <Tabs value={selectedTab} onChange={handleChangeTab}>
                    <Tab
                        label={browser.i18n.getMessage(
                            "options_page_section_timeline_hidden_events_dialog_tab_event_ids"
                        )}
                        value="event_ids"
                    />
                    <Tab
                        label={browser.i18n.getMessage(
                            "options_page_section_timeline_hidden_events_dialog_tab_courses"
                        )}
                        value="courses"
                    />
                    <Tab
                        label={browser.i18n.getMessage(
                            "options_page_section_timeline_hidden_events_dialog_tab_module_names"
                        )}
                        value="module_names"
                    />
                </Tabs>

                <TabPanel selectedTab={selectedTab} value="event_ids">
                    <HiddenEventIds />
                </TabPanel>
                <TabPanel selectedTab={selectedTab} value="courses">
                    <HiddenCourses />
                </TabPanel>
                <TabPanel selectedTab={selectedTab} value="module_names">
                    <HiddenModuleNames />
                </TabPanel>
            </DialogContent>
        </>
    );
};

const TabPanel: FC<PropsWithChildren<{ value: any; selectedTab: any }>> = (props) => {
    return (
        <Box component="div" hidden={props.value !== props.selectedTab} sx={{ width: "100%", height: "300px" }}>
            {props.children}
        </Box>
    );
};

const HiddenEventIds = () => {
    const [hiddenEventIds, setHiddenEventIds] = useConfig(ConfigKey.TimelineHiddenEventIds);
    const { value: events, error } = useAsyncGenerator(() => call("fetchMoodleTimeline", true), []);

    useNotifyError(error);

    const handleUnhide = (id: number) => {
        setHiddenEventIds(hiddenEventIds.filter((e) => e !== id));
    };

    return events ? (
        <>
            {hiddenEventIds.length === 0 ? (
                <>
                    <Divider />
                    <Center>
                        <Typography variant="body1">
                            {browser.i18n.getMessage("options_page_section_timeline_hidden_events_dialog_empty")}
                        </Typography>
                    </Center>
                </>
            ) : (
                <Stack spacing={1}>
                    <Divider />
                    {hiddenEventIds.map((id) => {
                        const event = events?.find((e) => e.id === id);
                        return (
                            <Fragment key={id}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <div style={{ flexGrow: 1 }}>
                                        {event?.name ??
                                            `${browser.i18n.getMessage(
                                                "options_page_section_timeline_hidden_events_dialog_unknown_item"
                                            )} (id: ${id})`}
                                    </div>
                                    <Button
                                        variant="outlined"
                                        sx={{ whiteSpace: "nowrap", minWidth: 80 }}
                                        onClick={() => handleUnhide(id)}
                                    >
                                        {browser.i18n.getMessage(
                                            "options_page_section_timeline_hidden_events_dialog_unhide_button"
                                        )}
                                    </Button>
                                </Stack>
                                <Divider />
                            </Fragment>
                        );
                    })}
                </Stack>
            )}
        </>
    ) : (
        <CenteredCircularProgress />
    );
};

const HiddenCourses = () => {
    const [hiddenCourses, setHiddenCourses] = useConfig(ConfigKey.TimelineHiddenCourses);
    const { value: courses, error } = useAsyncGenerator(() => call("fetchCourses"), []);

    useNotifyError(error);

    return courses ? (
        <>
            {hiddenCourses.length === 0 ? (
                <>
                    <Divider />
                    <Center>
                        <Typography variant="body1">
                            {browser.i18n.getMessage("options_page_section_timeline_hidden_events_dialog_empty")}
                        </Typography>
                    </Center>
                </>
            ) : (
                <Stack spacing={1}>
                    <Divider />
                    {hiddenCourses.map((id) => {
                        const course = courses?.find((e) => e.id === id);
                        return (
                            <Fragment key={id}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <div style={{ flexGrow: 1 }}>
                                        {course?.name ??
                                            `${browser.i18n.getMessage(
                                                "options_page_section_timeline_hidden_events_dialog_unknown_item"
                                            )} (id: ${id})`}
                                    </div>
                                    <Button
                                        variant="outlined"
                                        sx={{ whiteSpace: "nowrap", minWidth: 80 }}
                                        onClick={() => setHiddenCourses(hiddenCourses.filter((e) => e !== id))}
                                    >
                                        {browser.i18n.getMessage(
                                            "options_page_section_timeline_hidden_events_dialog_unhide_button"
                                        )}
                                    </Button>
                                </Stack>
                                <Divider />
                            </Fragment>
                        );
                    })}
                </Stack>
            )}
        </>
    ) : (
        <CenteredCircularProgress />
    );
};

const HiddenModuleNames = () => {
    const [hiddenModuleNames, setHiddenModuleNames] = useConfig(ConfigKey.TimelineHiddenModuleNames);

    return hiddenModuleNames.length === 0 ? (
        <>
            <Divider />
            <Center>
                <Typography variant="body1">
                    {browser.i18n.getMessage("options_page_section_timeline_hidden_events_dialog_empty")}
                </Typography>
            </Center>
        </>
    ) : (
        <Stack spacing={1}>
            <Divider />
            {hiddenModuleNames.map((name) => (
                <Fragment key={name}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <div style={{ flexGrow: 1 }}>{browser.i18n.getMessage(`moodle_module_${name}`) || name}</div>
                        <Button
                            variant="outlined"
                            sx={{ whiteSpace: "nowrap", minWidth: 80 }}
                            onClick={() => setHiddenModuleNames(hiddenModuleNames.filter((e) => e !== name))}
                        >
                            {browser.i18n.getMessage(
                                "options_page_section_timeline_hidden_events_dialog_unhide_button"
                            )}
                        </Button>
                    </Stack>
                    <Divider />
                </Fragment>
            ))}
        </Stack>
    );
};
