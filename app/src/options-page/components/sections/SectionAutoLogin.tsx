import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import React, { ReactElement } from 'react';
import useConfig from '../../../common/react/useConfig';
import { SectionComponentProps } from '../Options';
import Section from '../Section';

export default function SectionAutoLogin(props: SectionComponentProps): ReactElement | null {
    const [enabled, setEnabled] = useConfig('autoLogin.enabled');
    const [loginId, setLoginId] = useConfig('autoLogin.loginId');
    const [password, setPassword] = useConfig('autoLogin.password');

    if (enabled === undefined || loginId === undefined || password === undefined) return null;

    function handleSwitchChange(setStateFunc: (value: boolean) => void) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setStateFunc(event.target.checked);
        };
    }
    function handleTextFieldChange(setStateFunc: (value: string) => void) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setStateFunc(event.target.value);
        };
    }

    return (
        <Section titleMessageName="optionsSectionAutoLogin" {...props}>
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={enabled} onChange={handleSwitchChange(setEnabled)} />}
                    label={browser.i18n.getMessage('optionsEnableAutoLogin')}
                />
                <TextField
                    value={loginId}
                    onChange={handleTextFieldChange(setLoginId)}
                    label={browser.i18n.getMessage('optionsLoginId')}
                    disabled={!enabled}
                />
                <TextField
                    value={password}
                    type="password"
                    onChange={handleTextFieldChange(setPassword)}
                    label={browser.i18n.getMessage('optionsPassword')}
                    disabled={!enabled}
                />
            </FormGroup>
        </Section>
    );
}
