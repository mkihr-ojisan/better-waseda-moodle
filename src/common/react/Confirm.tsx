import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { FC } from "react";

export type ConfirmProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    okButtonText?: string;
    cancelButtonText?: string;
    onOk?: () => void;
    onCancel?: () => void;
};

export const Confirm: FC<ConfirmProps> = (props) => {
    return (
        <Dialog open={props.open} onClose={props.onClose} closeAfterTransition>
            {props.open && <ConfirmContent {...props} />}
        </Dialog>
    );
};

const ConfirmContent: FC<ConfirmProps> = (props) => {
    const handleOk = () => {
        props.onOk?.();
        props.onClose();
    };
    const handleCancel = () => {
        props.onCancel?.();
        props.onClose();
    };

    return (
        <>
            {props.title && <DialogTitle>{props.title}</DialogTitle>}
            <DialogContent>
                <DialogContentText>{props.message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>{props.cancelButtonText ?? browser.i18n.getMessage("cancel")}</Button>
                <Button onClick={handleOk}>{props.okButtonText ?? browser.i18n.getMessage("ok")}</Button>
            </DialogActions>
        </>
    );
};
