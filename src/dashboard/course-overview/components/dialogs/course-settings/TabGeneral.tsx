import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { FC } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
// import { SketchPicker } from "react-color";
import { useConfig } from "@/common/config/useConfig";
import { ConfigKey, getConfig } from "@/common/config/config";
import { ColorPicker } from "@/common/react/components/color-picker/ColorPicker";
import { DEFAULT_COURSE_COLOR } from "@/common/course/course-color";

export type TabGeneralProps = {
    value: TabGeneralValues;
    setValue: (value: TabGeneralValues) => void;
    defaultName: string | undefined;
    defaultColor: string | undefined;
};

export type TabGeneralValues = {
    name: string;
    syllabusURL: string;
    deliveryMethod: "face_to_face" | "realtime_streaming" | "on_demand" | "none";
    streamingURL: string;
    color: string | undefined;
    note: string;
    assignmentFilenameTemplate: string;
    customCourseUrl?: string;
};

export const TabGeneral: FC<TabGeneralProps> = ({ value, setValue, defaultName, defaultColor }) => {
    const [assignmentFilenameEnabled] = useConfig(ConfigKey.AssignmentFilenameEnabled);

    return (
        <>
            <TextField
                label={browser.i18n.getMessage("course_settings_dialog_general_course_name")}
                fullWidth
                margin="dense"
                value={value.name}
                onChange={(e) => setValue({ ...value, name: e.target.value })}
                InputProps={{
                    endAdornment: defaultName ? (
                        <SetToDefaultButton onClick={() => setValue({ ...value, name: defaultName ?? "" })} />
                    ) : undefined,
                }}
            />

            {value.customCourseUrl !== undefined && (
                <TextField
                    label={browser.i18n.getMessage("course_settings_dialog_general_custom_course_url")}
                    fullWidth
                    margin="dense"
                    value={value.customCourseUrl}
                    onChange={(e) => setValue({ ...value, customCourseUrl: e.target.value })}
                />
            )}

            <TextField
                label={browser.i18n.getMessage("course_settings_dialog_general_syllabus")}
                fullWidth
                margin="dense"
                value={value.syllabusURL}
                onChange={(e) => setValue({ ...value, syllabusURL: e.target.value })}
            />

            <FormControl fullWidth margin="dense">
                <InputLabel id="delivery-method-label">
                    {browser.i18n.getMessage("course_settings_dialog_general_delivery_method")}
                </InputLabel>
                <Select
                    labelId="delivery-method-label"
                    label={browser.i18n.getMessage("course_settings_dialog_general_delivery_method")}
                    value={value.deliveryMethod}
                    onChange={(e) =>
                        setValue({ ...value, deliveryMethod: e.target.value as TabGeneralValues["deliveryMethod"] })
                    }
                >
                    <MenuItem value="none">{browser.i18n.getMessage("course_delivery_method_none")}</MenuItem>
                    <MenuItem value="face_to_face">
                        {browser.i18n.getMessage("course_delivery_method_face_to_face")}
                    </MenuItem>
                    <MenuItem value="realtime_streaming">
                        {browser.i18n.getMessage("course_delivery_method_realtime_streaming")}
                    </MenuItem>
                    <MenuItem value="on_demand">{browser.i18n.getMessage("course_delivery_method_on_demand")}</MenuItem>
                </Select>
            </FormControl>

            {value.deliveryMethod === "realtime_streaming" && (
                <TextField
                    label={browser.i18n.getMessage("course_settings_dialog_general_streaming_url")}
                    fullWidth
                    margin="dense"
                    value={value.streamingURL}
                    onChange={(e) => setValue({ ...value, streamingURL: e.target.value })}
                />
            )}

            <ColorPicker
                textFieldProps={{
                    label: browser.i18n.getMessage("course_settings_dialog_general_color"),
                    fullWidth: true,
                    margin: "dense",
                }}
                value={value.color ?? DEFAULT_COURSE_COLOR}
                defaultValue={defaultColor}
                onChange={(color) => setValue({ ...value, color })}
            />

            {assignmentFilenameEnabled && (
                <TextField
                    label={browser.i18n.getMessage("course_settings_dialog_filename_template")}
                    fullWidth
                    margin="dense"
                    value={value.assignmentFilenameTemplate}
                    onChange={(e) => setValue({ ...value, assignmentFilenameTemplate: e.target.value })}
                    InputProps={{
                        endAdornment: (
                            <SetToDefaultButton
                                onClick={() =>
                                    setValue({
                                        ...value,
                                        assignmentFilenameTemplate: getConfig(ConfigKey.AssignmentFilenameTemplate),
                                    })
                                }
                            />
                        ),
                    }}
                />
            )}

            <TextField
                label={browser.i18n.getMessage("course_settings_dialog_general_note")}
                fullWidth
                multiline
                minRows={3}
                margin="dense"
                value={value.note}
                onChange={(e) => setValue({ ...value, note: e.target.value })}
            />
        </>
    );
};

export const SetToDefaultButton: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <InputAdornment position="end">
            <IconButton onClick={onClick} title={browser.i18n.getMessage("set_default")}>
                <ReplayIcon />
            </IconButton>
        </InputAdornment>
    );
};
