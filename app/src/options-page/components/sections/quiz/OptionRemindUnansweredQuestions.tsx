import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import useConfig from '../../../../common/react/useConfig';
import Description from '../../Description';

export default function OptionRemindUnansweredQuestions(): ReactElement | null {
    const [enabled, setEnabled] = useConfig('quiz.remindUnansweredQuestions.enabled');

    if (enabled === undefined) return null;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEnabled(event.target.checked);
    }

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
