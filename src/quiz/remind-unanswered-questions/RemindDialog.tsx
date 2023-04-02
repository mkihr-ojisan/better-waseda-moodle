import { BWMRoot } from "@/common/react/root";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import React, { FC, ReactElement, useCallback } from "react";
import { Question } from "./questions";

export type RemindDialogProps = {
    open: boolean;
    onClose: () => void;
    onContinue: () => void;
    unansweredQuestions: Question[];
};

export const RemindDialog: FC<RemindDialogProps> = (props): ReactElement => {
    const handleClickBack = useCallback(() => {
        props.onClose();
    }, [props]);

    const handleClickContinue = useCallback(() => {
        props.onClose();
        props.onContinue();
    }, [props]);

    return (
        <BWMRoot>
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogContent>
                    <Box mb={1}>{browser.i18n.getMessage("quiz_remind_unanswered_questions_dialog_message")}</Box>
                    <ul>
                        {props.unansweredQuestions.map((q) => (
                            <li key={q.name}>{q.name}</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" autoFocus onClick={handleClickBack}>
                        {browser.i18n.getMessage("quiz_remind_unanswered_questions_dialog_back")}
                    </Button>
                    <Button color="primary" onClick={handleClickContinue}>
                        {browser.i18n.getMessage("quiz_remind_unanswered_questions_dialog_continue")}
                    </Button>
                </DialogActions>
            </Dialog>
        </BWMRoot>
    );
};
