import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement, useEffect, useState } from 'react';
import {
    checkConflictWhenEnablingConfigSync,
    disableConfigSync,
    enableConfigSync,
    isConfigSyncEnabled,
} from '../../../../common/config/sync';
import Description from '../../Description';

export default function OptionConfigSync(): ReactElement | null {
    const isConfigSyncEnabled = useIsConfigSyncEnabled();
    const [syncEnableModeSelectionDialogOpen, setSyncEnableModeSelectionDialogOpen] = useState(false);

    if (isConfigSyncEnabled === undefined) return null;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.checked) {
            handleEnableSync();
        } else {
            handleDisableSync();
        }
    }
    async function handleEnableSync() {
        if (await checkConflictWhenEnablingConfigSync()) {
            setSyncEnableModeSelectionDialogOpen(true);
        } else {
            await enableConfigSync('discard_local');

            // FirefoxはenableConfigSync内で呼ばれるbrowser.runtime.reloadで設定ページも再読込みされるが、Chromeではされないしlocation.reloadも効かないので
            window.close();
        }
    }
    async function handleDisableSync() {
        await disableConfigSync();

        window.close();
    }

    return (
        <>
            <FormControlLabel
                control={<Switch checked={isConfigSyncEnabled} onChange={handleChange} />}
                label={browser.i18n.getMessage('optionsSyncConfig')}
            />
            <Description messageName="optionsSyncConfigDescription" />

            <SyncEnableModeSelectionDialog
                open={syncEnableModeSelectionDialogOpen}
                onClose={() => setSyncEnableModeSelectionDialogOpen(false)}
            />
        </>
    );
}
function useIsConfigSyncEnabled(): boolean | undefined {
    const [value, setValue] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        let isCancelled = false;
        isConfigSyncEnabled().then((v) => {
            if (!isCancelled) setValue(v);
        });

        return () => {
            isCancelled = true;
        };
    }, []);

    return value;
}

type SyncEnableModeSelectionDialogProps = {
    open: boolean;
    onClose: () => void;
};
function SyncEnableModeSelectionDialog(props: SyncEnableModeSelectionDialogProps): ReactElement {
    const [selectedMode, setSelectedMode] = useState<'discard_local' | 'force_upload'>('discard_local');

    function handleChange(_event: React.ChangeEvent<HTMLInputElement>, value: string) {
        setSelectedMode(value as 'discard_local' | 'force_upload');
    }
    async function handleOK() {
        await enableConfigSync(selectedMode);

        window.close();
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogContent>
                <DialogContentText>
                    {browser.i18n.getMessage('optionsSyncEnableModeSelectionDialogMessage')}
                </DialogContentText>
                <RadioGroup value={selectedMode} onChange={handleChange}>
                    <FormControlLabel
                        value="discard_local"
                        control={<Radio />}
                        label={browser.i18n.getMessage('optionsSyncEnableModeSelectionDialogDiscardLocal')}
                    />
                    <FormControlLabel
                        value="force_upload"
                        control={<Radio />}
                        label={browser.i18n.getMessage('optionsSyncEnableModeSelectionDialogForceUpload')}
                    />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    {browser.i18n.getMessage('cancel')}
                </Button>
                <Button onClick={handleOK} color="primary">
                    {browser.i18n.getMessage('optionsSyncEnableModeSelectionDialogOK')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
