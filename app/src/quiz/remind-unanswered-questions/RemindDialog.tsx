import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { ReactElement } from 'react';
import BWMThemeDarkReader from '../../common/react/theme/BWMThemeDarkReader';
import { Question } from './questions';

type Props = {
    open: boolean;
    onClose: () => void;
    onContinue: () => void;
    unansweredQuestions: Question[];
};

export default function RemindDialog(props: Props): ReactElement {

    function handleClickBack() {
        props.onClose();
    }

    function handleClickContinue() {
        props.onClose();
        props.onContinue();
    }

    return (
        <BWMThemeDarkReader>
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogContent>
                    <Box mb={1}>
                        {browser.i18n.getMessage('quizRemindUnansweredQuestionsDialogMessage')}
                    </Box>
                    <ul>
                        {
                            props.unansweredQuestions.map(q => (
                                <li key={q.name}>{q.name}</li>
                            ))
                        }
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
}