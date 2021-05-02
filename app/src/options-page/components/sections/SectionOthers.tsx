import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement, useState } from 'react';
import { getStorage } from '../../../common/config/config';
import AutoCloseAlert from '../../../common/react/AutoCloseAlert';
import useConfig from '../../../common/react/useConfig';
import Description from '../Description';
import { SectionComponentProps } from '../Options';
import Section from '../Section';

export default function SectionOthers(props: SectionComponentProps): ReactElement | null {
    const [viewInBrowserEnabled, setViewInBrowserEnabled] = useConfig('viewInBrowser.enabled');
    const [removeLoadingVideoEnabled, setRemoveLoadingVideoEnabled] = useConfig('removeLoadingVideo.enabled');
    const [checkNotesOnSubmitting, setCheckNotesOnSubmitting] = useConfig('checkNotesOnSubmitting.enabled');
    const [moreVisibleRemainingTime, setMoreVisibleRemainingTime] = useConfig('moreVisibleRemainingTime.enabled');
    const [disableRateLimitEnabled, setDisableRateLimitEnabled] = useConfig('disableRateLimit.enabled');
    const [hideNameEnabled, setHideNameEnabled] = useConfig('hideName.enabled');
    const [syllabusLinkFixEnabled, setSyllabusLinkFixEnabled] = useConfig('syllabusLinkFix.enabled');

    const [configRestoredMessageOpen, setConfigRestoredMessageOpen] = useState(false);
    const [configRestoreError, setConfigRestoreError] = useState<string | null>(null);

    if (viewInBrowserEnabled === undefined
        || removeLoadingVideoEnabled === undefined
        || checkNotesOnSubmitting === undefined
        || moreVisibleRemainingTime === undefined
        || disableRateLimitEnabled === undefined
        || hideNameEnabled === undefined
        || syllabusLinkFixEnabled === undefined) return null;

    function handleSwitchChange(setStateFunc: (value: boolean) => void) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setStateFunc(event.target.checked);
        };
    }

    async function handleBackupConfig() {
        const config = await (await getStorage()).get();
        const a = document.createElement('a');
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, undefined, 2));
        a.download = 'better-waseda-moodle-' + formatDate(new Date()) + '.json';
        a.click();
    }

    function handleRestoreConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            let config;
            try {
                config = JSON.parse(await file.text());
            } catch (ex) {
                setConfigRestoredMessageOpen(true);
                setConfigRestoreError(browser.i18n.getMessage('otherError', ex.message));
                return;
            }

            const storage = await getStorage();
            await storage.clear();
            await storage.set(config);
            setConfigRestoredMessageOpen(true);
            setConfigRestoreError(null);
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
                <a href="https://wcms.waseda.jp/settings/viewer/uniplayer/intro.mp4?" target='_blank'>{browser.i18n.getMessage('optionsRemoveLoadingVideoDescription')}</a>
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

            <FormControlLabel
                control={<Switch checked={disableRateLimitEnabled} onChange={handleSwitchChange(setDisableRateLimitEnabled)} />}
                label={browser.i18n.getMessage('optionsDisableRateLimitEnabled')}
            />
            <Description messageName="optionsDisableRateLimitEnabledDescription" />

            <FormControlLabel
                control={<Switch checked={hideNameEnabled} onChange={handleSwitchChange(setHideNameEnabled)} />}
                label={browser.i18n.getMessage('optionsHideNameEnabled')}
            />
            <Description messageName="optionsHideNameEnabledDescription" />

            <FormControlLabel
                control={<Switch checked={syllabusLinkFixEnabled} onChange={handleSwitchChange(setSyllabusLinkFixEnabled)} />}
                label={browser.i18n.getMessage('optionsSyllabusLinkFixEnabled')}
            />
            <Description messageName="optionsSyllabusLinkFixEnabledDescription" />

            <Grid container spacing={1}>
                <Grid item>
                    <Button variant="outlined" onClick={handleBackupConfig}>
                        {browser.i18n.getMessage('optionsBackupConfig')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={handleRestoreConfig}>
                        {browser.i18n.getMessage('optionsRestoreConfig')}
                    </Button>
                </Grid>
            </Grid>
            <AutoCloseAlert
                open={configRestoredMessageOpen}
                onClose={() => setConfigRestoredMessageOpen(false)}
                severity={configRestoreError ? 'error' : 'success'}
            >
                {configRestoreError ?? browser.i18n.getMessage('optionsRestoreConfigSuccess')}
            </AutoCloseAlert>
        </Section>
    );
}

function formatDate(date: Date) {
    return date.getFullYear() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
}