import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import { useCallback } from 'react';
import useConfig from '../../../../common/react/useConfig';
import Description from '../../Description';

export default function OptionCheckSession(): ReactElement | null {
    const [enabled, setEnabled] = useConfig('checkSession.enabled');
    const [quiz, setQuiz] = useConfig('checkSession.quiz');
    const [assignment, setAssignment] = useConfig('checkSession.assignment');
    const [forum, setForum] = useConfig('checkSession.forum');

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setEnabled(event.target.checked);
        },
        [setEnabled]
    );

    const handleChangeQuiz = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setQuiz(event.target.checked);
        },
        [setQuiz]
    );
    const handleChangeAssignment = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setAssignment(event.target.checked);
        },
        [setAssignment]
    );
    const handleChangeForum = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setForum(event.target.checked);
        },
        [setForum]
    );

    return (
        <>
            <FormControlLabel
                control={<Switch checked={enabled} onChange={handleChange} />}
                label={browser.i18n.getMessage('optionsCheckSessionEnabled')}
            />
            <Description>{browser.i18n.getMessage('optionsCheckSessionEnabledDescription')}</Description>

            <Box ml={4}>
                <FormControlLabel
                    control={<Checkbox checked={quiz} onChange={handleChangeQuiz} disabled={!enabled} />}
                    label={browser.i18n.getMessage('optionsCheckSessionQuiz')}
                />
                <FormControlLabel
                    control={<Checkbox checked={assignment} onChange={handleChangeAssignment} disabled={!enabled} />}
                    label={browser.i18n.getMessage('optionsCheckSessionAssignment')}
                />
                <FormControlLabel
                    control={<Checkbox checked={forum} onChange={handleChangeForum} disabled={!enabled} />}
                    label={browser.i18n.getMessage('optionsCheckSessionForum')}
                />
            </Box>
        </>
    );
}
