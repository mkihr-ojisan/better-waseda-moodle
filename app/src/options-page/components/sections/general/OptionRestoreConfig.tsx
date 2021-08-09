import Button from '@material-ui/core/Button';
import React, { ReactElement, useState } from 'react';
import { useCallback } from 'react';
import { importConfig } from '../../../../common/config/config';
import AutoCloseAlert from '../../../../common/react/AutoCloseAlert';

export default function OptionRestoreConfig(): ReactElement {
    const [configRestoredMessageOpen, setConfigRestoredMessageOpen] = useState(false);
    const [configRestoreError, setConfigRestoreError] = useState<string | null>(null);

    const handleRestoreConfig = useCallback(() => {
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

            await importConfig(config);

            setConfigRestoredMessageOpen(true);
            setConfigRestoreError(null);
        };
    }, []);
    const handleConfigRestoredMessageClose = useCallback(() => setConfigRestoredMessageOpen(false), []);

    return (
        <>
            <Button variant="outlined" onClick={handleRestoreConfig}>
                {browser.i18n.getMessage('optionsRestoreConfig')}
            </Button>

            <AutoCloseAlert
                open={configRestoredMessageOpen}
                onClose={handleConfigRestoredMessageClose}
                severity={configRestoreError ? 'error' : 'success'}
            >
                {configRestoreError ?? browser.i18n.getMessage('optionsRestoreConfigSuccess')}
            </AutoCloseAlert>
        </>
    );
}
