import { call } from "@/common/util/messenger/client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { FC, useState } from "react";
import { useCourseOverviewContext } from "../CourseOverview";

export type AddCustomCourseDialogProps = {
    open: boolean;
    onClose: () => void;
};

export const AddCustomCourseDialog: FC<AddCustomCourseDialogProps> = (props) => {
    return (
        <Dialog open={props.open} onClose={props.onClose} closeAfterTransition maxWidth="sm" fullWidth>
            {props.open && <AddCustomCourseDialogContent {...props} />}
        </Dialog>
    );
};

const AddCustomCourseDialogContent: FC<AddCustomCourseDialogProps> = (props) => {
    const context = useCourseOverviewContext();

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    const handleAdd = async () => {
        await call("addCustomCourse", { name, url, hidden: false, courseKey: null });
        props.onClose();
        context.reloadCourses(true);
    };

    return (
        <>
            <DialogTitle>{browser.i18n.getMessage("add_custom_course_dialog_title")}</DialogTitle>
            <DialogContent>
                <TextField
                    label={browser.i18n.getMessage("add_custom_course_dialog_course_name")}
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label={browser.i18n.getMessage("add_custom_course_dialog_course_url")}
                    fullWidth
                    variant="standard"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>{browser.i18n.getMessage("cancel")}</Button>
                <Button onClick={handleAdd}>
                    {browser.i18n.getMessage("add_custom_course_dialog_course_name_button_add")}
                </Button>
            </DialogActions>
        </>
    );
};
