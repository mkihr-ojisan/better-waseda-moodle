import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import { useCallback } from 'react';
import useConfig from '../../../../common/react/useConfig';
import Description from '../../Description';

export default function OptionRemindUnansweredQuestions(): ReactElement | null {
    const [enabled, setEnabled] = useConfig('quiz.remindUnansweredQuestions.enabled');

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setEnabled(event.target.checked);
        },
        [setEnabled]
    );

    return (
        <>
            <FormControlLabel
                control={<Switch checked={enabled} onChange={handleChange} />}
                label={browser.i18n.getMessage('optionsQuizRemindUnansweredQuestions')}
            />
            <Description messageName="optionsQuizRemindUnansweredQuestionsDescription" />
        </>
    );
}
