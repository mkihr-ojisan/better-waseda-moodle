import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { ReactElement, useState } from 'react';
import { useCallback } from 'react';
import { importConfig } from '../../../../common/config/config';
import Action from '../../options/Action';

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
                setConfigRestoreError(browser.i18n.getMessage('otherError', `${ex}`));
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
            <Action
                message="optionsRestoreConfig"
                description="optionsRestoreConfigDescription"
                buttonMessage="optionsRestoreConfigButton"
                onClick={handleRestoreConfig}
            />

            <Snackbar
                open={configRestoredMessageOpen}
                onClose={handleConfigRestoredMessageClose}
                autoHideDuration={5000}
            >
                <Alert
                    severity={configRestoreError ? 'error' : 'success'}
                    onClose={handleConfigRestoredMessageClose}
                    variant="filled"
                >
                    {configRestoreError ?? browser.i18n.getMessage('optionsRestoreConfigSuccess')}
                </Alert>
            </Snackbar>
        </>
    );
}
