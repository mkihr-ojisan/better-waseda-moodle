import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import useConfig from '../../../../common/react/useConfig';
import Description from '../../Description';
import { SectionComponentProps } from '../../Options';
import Section from '../../Section';
import OptionCheckSession from './OptionCheckSession';

export default React.memo(function SectionOthers(props: SectionComponentProps): ReactElement | null {
    const [viewInBrowserEnabled, setViewInBrowserEnabled] = useConfig('viewInBrowser.enabled');
    const [removeLoadingVideoEnabled, setRemoveLoadingVideoEnabled] = useConfig('removeLoadingVideo.enabled');
    const [checkNotesOnSubmitting, setCheckNotesOnSubmitting] = useConfig('checkNotesOnSubmitting.enabled');
    const [disableRateLimitEnabled, setDisableRateLimitEnabled] = useConfig('disableRateLimit.enabled');
    const [hideNameEnabled, setHideNameEnabled] = useConfig('hideName.enabled');
    const [syllabusLinkFixEnabled, setSyllabusLinkFixEnabled] = useConfig('syllabusLinkFix.enabled');

    if (
        viewInBrowserEnabled === undefined ||
        removeLoadingVideoEnabled === undefined ||
        checkNotesOnSubmitting === undefined ||
        disableRateLimitEnabled === undefined ||
        hideNameEnabled === undefined ||
        syllabusLinkFixEnabled === undefined
    )
        return null;

    function handleSwitchChange(setStateFunc: (value: boolean) => void) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setStateFunc(event.target.checked);
        };
    }

    return (
        <Section titleMessageName="optionsSectionOthers" {...props}>
            <FormControlLabel
                control={
                    <Switch checked={viewInBrowserEnabled} onChange={handleSwitchChange(setViewInBrowserEnabled)} />
                }
                label={browser.i18n.getMessage('optionsViewInBrowserEnabled')}
            />
            <Description messageName="optionsViewInBrowserDescription" />

            <FormControlLabel
                control={
                    <Switch
                        checked={removeLoadingVideoEnabled}
                        onChange={handleSwitchChange(setRemoveLoadingVideoEnabled)}
                    />
                }
                label={browser.i18n.getMessage('optionsRemoveLoadingVideo')}
            />
            <Description>
                <ReactMarkdown linkTarget="_blank">
                    {browser.i18n.getMessage('optionsRemoveLoadingVideoDescription')}
                </ReactMarkdown>
            </Description>

            <FormControlLabel
                control={
                    <Switch checked={checkNotesOnSubmitting} onChange={handleSwitchChange(setCheckNotesOnSubmitting)} />
                }
                label={browser.i18n.getMessage('optionsCheckNotesOnSubmitting')}
            />
            <Description messageName="optionsCheckNotesOnSubmittingDescription" />

            <FormControlLabel
                control={
                    <Switch
                        checked={disableRateLimitEnabled}
                        onChange={handleSwitchChange(setDisableRateLimitEnabled)}
                    />
                }
                label={browser.i18n.getMessage('optionsDisableRateLimitEnabled')}
            />
            <Description messageName="optionsDisableRateLimitEnabledDescription" />

            <FormControlLabel
                control={<Switch checked={hideNameEnabled} onChange={handleSwitchChange(setHideNameEnabled)} />}
                label={browser.i18n.getMessage('optionsHideNameEnabled')}
            />
            <Description messageName="optionsHideNameEnabledDescription" />

            <FormControlLabel
                control={
                    <Switch checked={syllabusLinkFixEnabled} onChange={handleSwitchChange(setSyllabusLinkFixEnabled)} />
                }
                label={browser.i18n.getMessage('optionsSyllabusLinkFixEnabled')}
            />
            <Description messageName="optionsSyllabusLinkFixEnabledDescription" />

            <OptionCheckSession />
        </Section>
    );
});
