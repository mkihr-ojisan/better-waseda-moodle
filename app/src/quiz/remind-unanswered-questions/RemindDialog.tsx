import Box from '@mui/material/Box';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, { ReactElement } from 'react';
import { useCallback } from 'react';
import BWMThemeDarkReader from '../../common/react/theme/BWMThemeDarkReader';
import { Question } from './questions';

type Props = {
    open: boolean;
    onClose: () => void;
    onContinue: () => void;
    unansweredQuestions: Question[];
};

export default React.memo(function RemindDialog(props: Props): ReactElement {
    const handleClickBack = useCallback(() => {
        props.onClose();
    }, [props]);

    const handleClickContinue = useCallback(() => {
        props.onClose();
        props.onContinue();
    }, [props]);

    return (
        <BWMThemeDarkReader>
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogContent>
                    <Box mb={1}>{browser.i18n.getMessage('quizRemindUnansweredQuestionsDialogMessage')}</Box>
                    <ul>
                        {props.unansweredQuestions.map((q) => (
                            <li key={q.name}>{q.name}</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" autoFocus onClick={handleClickBack}>
                        {browser.i18n.getMessage('quizRemindUnansweredQuestionsDialogBack')}
                    </Button>
                    <Button color="primary" onClick={handleClickContinue}>
                        {browser.i18n.getMessage('quizRemindUnansweredQuestionsDialogContinue')}
                    </Button>
                </DialogActions>
            </Dialog>
        </BWMThemeDarkReader>
    );
});
