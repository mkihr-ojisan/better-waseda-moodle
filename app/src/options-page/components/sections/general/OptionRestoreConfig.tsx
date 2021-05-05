import Button from '@material-ui/core/Button';
import React, { ReactElement, useState } from 'react';
import { getStorage } from '../../../../common/config/config';
import { CONFIG_SYNC_ENABLED_CONFIG_KEY, isConfigSyncEnabled } from '../../../../common/config/sync';
import AutoCloseAlert from '../../../../common/react/AutoCloseAlert';

export default function OptionRestoreConfig(): ReactElement {
    const [configRestoredMessageOpen, setConfigRestoredMessageOpen] = useState(false);
    const [configRestoreError, setConfigRestoreError] = useState<string | null>(null);

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

            const configSyncEnabled = await isConfigSyncEnabled();
            const storage = await getStorage();
            await storage.clear();
            await storage.set(config);
            browser.storage.local.set({ [CONFIG_SYNC_ENABLED_CONFIG_KEY]: configSyncEnabled });

            setConfigRestoredMessageOpen(true);
            setConfigRestoreError(null);
        };
    }

    return (
        <>
            <Button variant="outlined" onClick={handleRestoreConfig}>
                {browser.i18n.getMessage('optionsRestoreConfig')}
            </Button>

            <AutoCloseAlert
                open={configRestoredMessageOpen}
                onClose={() => setConfigRestoredMessageOpen(false)}
                severity={configRestoreError ? 'error' : 'success'}
            >
                {configRestoreError ?? browser.i18n.getMessage('optionsRestoreConfigSuccess')}
            </AutoCloseAlert>
        </>
    );
}