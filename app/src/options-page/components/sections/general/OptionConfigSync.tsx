import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import React, { ReactElement, useState } from 'react';
import { useCallback } from 'react';
import {
    checkConflictWhenEnablingConfigSync,
    disableConfigSync,
    enableConfigSync,
} from '../../../../common/config/config';
import useConfig from '../../../../common/react/useConfig';
import Description from '../../Description';

export default function OptionConfigSync(): ReactElement | null {
    const [isConfigSyncEnabled] = useConfig('config.sync.enabled');
    const [syncEnableModeSelectionDialogOpen, setSyncEnableModeSelectionDialogOpen] = useState(false);

    const handleEnableSync = useCallback(async () => {
        if (await checkConflictWhenEnablingConfigSync()) {
            setSyncEnableModeSelectionDialogOpen(true);
        } else {
            await enableConfigSync('discard_local');
        }
    }, []);
    const handleDisableSync = useCallback(async () => {
        await disableConfigSync();
    }, []);
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                handleEnableSync();
            } else {
                handleDisableSync();
            }
        },
        [handleDisableSync, handleEnableSync]
    );
    const handleSyncEnableModeSelectionDialogClose = useCallback(() => setSyncEnableModeSelectionDialogOpen(false), []);

    return (
        <>
            <FormControlLabel
                control={<Switch checked={isConfigSyncEnabled} onChange={handleChange} />}
                label={browser.i18n.getMessage('optionsSyncConfig')}
            />
            <Description messageName="optionsSyncConfigDescription" />

            <SyncEnableModeSelectionDialog
                open={syncEnableModeSelectionDialogOpen}
                onClose={handleSyncEnableModeSelectionDialogClose}
            />
        </>
    );
}

type SyncEnableModeSelectionDialogProps = {
    open: boolean;
    onClose: () => void;
};
function SyncEnableModeSelectionDialog(props: SyncEnableModeSelectionDialogProps): ReactElement {
    const [selectedMode, setSelectedMode] = useState<'discard_local' | 'force_upload'>('discard_local');

    const handleChange = useCallback((_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setSelectedMode(value as 'discard_local' | 'force_upload');
    }, []);
    const handleOK = useCallback(async () => {
        await enableConfigSync(selectedMode);
        props.onClose();
    }, [props, selectedMode]);

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
