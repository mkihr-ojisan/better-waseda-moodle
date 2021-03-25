import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import useConfig from '../../../common/react/useConfig';
import Description from '../Description';
import { SectionComponentProps } from '../Options';
import Section from '../Section';

export default function SectionOthers(props: SectionComponentProps): ReactElement | null {
    const [viewInBrowserEnabled, setViewInBrowserEnabled] = useConfig('viewInBrowser.enabled');
    const [removeLoadingVideoEnabled, setRemoveLoadingVideoEnabled] = useConfig('removeLoadingVideo.enabled');
    const [checkNotesOnSubmitting, setCheckNotesOnSubmitting] = useConfig('checkNotesOnSubmitting.enabled');
    const [moreVisibleRemainingTime, setMoreVisibleRemainingTime] = useConfig('moreVisibleRemainingTime.enabled');

    if (viewInBrowserEnabled === undefined
        || removeLoadingVideoEnabled === undefined
        || checkNotesOnSubmitting === undefined
        || moreVisibleRemainingTime === undefined) return null;

    function handleSwitchChange(setStateFunc: (value: boolean) => void) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setStateFunc(event.target.checked);
        };
    }

    return (
        <Section titleMessageName="optionsSectionOthers" {...props}>
            <FormControlLabel
                control={<Switch checked={viewInBrowserEnabled} onChange={handleSwitchChange(setViewInBrowserEnabled)} />}
                label={browser.i18n.getMessage('optionsViewInBrowserEnabled')}
            />
            <Description messageName="optionsViewInBrowserDescription" />

            <FormControlLabel
                control={<Switch checked={removeLoadingVideoEnabled} onChange={handleSwitchChange(setRemoveLoadingVideoEnabled)} />}
                label={browser.i18n.getMessage('optionsRemoveLoadingVideo')}
            />
            <Description>
                <a href="https://wcms.waseda.jp/settings/viewer/uniplayer/intro.mp4?">{browser.i18n.getMessage('optionsRemoveLoadingVideoDescription')}</a>
            </Description>

            <FormControlLabel
                control={<Switch checked={checkNotesOnSubmitting} onChange={handleSwitchChange(setCheckNotesOnSubmitting)} />}
                label={browser.i18n.getMessage('optionsCheckNotesOnSubmitting')}
            />
            <Description messageName="optionsCheckNotesOnSubmittingDescription" />

            <FormControlLabel
                control={<Switch checked={moreVisibleRemainingTime} onChange={handleSwitchChange(setMoreVisibleRemainingTime)} />}
                label={browser.i18n.getMessage('optionsMoreVisibleRemainingTime')}
            />
            <Description messageName="optionsMoreVisibleRemainingTimeDescription" />
        </Section>
    );
}