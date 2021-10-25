import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import makeStyles from '@mui/styles/makeStyles';
import Switch from '@mui/material/Switch';
import React, { ReactElement, useCallback, useState } from 'react';
import {
    checkConflictWhenEnablingConfigSync,
    disableConfigSync,
    enableConfigSync,
} from '../../../../common/config/config';
import useConfig from '../../../../common/react/useConfig';

const useStyles = makeStyles(() => ({
    listItemRoot: {
        paddingRight: 70,
    },
}));

export default React.memo(function ToggleOption() {
    const classes = useStyles();
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
    const handleClick = useCallback(() => {
        if (isConfigSyncEnabled) {
            handleDisableSync();
        } else {
            handleEnableSync();
        }
    }, [handleDisableSync, handleEnableSync, isConfigSyncEnabled]);
    const handleSyncEnableModeSelectionDialogClose = useCallback(() => setSyncEnableModeSelectionDialogOpen(false), []);

    return (
        <>
            <ListItem button onClick={handleClick} classes={{ root: classes.listItemRoot }}>
                <ListItemText
                    primary={browser.i18n.getMessage('optionsSyncConfig')}
                    secondary={browser.i18n.getMessage('optionsSyncConfigDescription')}
                />
                <ListItemSecondaryAction>
                    <Switch checked={isConfigSyncEnabled} onClick={handleClick} />
                </ListItemSecondaryAction>
            </ListItem>

            <SyncEnableModeSelectionDialog
                open={syncEnableModeSelectionDialogOpen}
                onClose={handleSyncEnableModeSelectionDialogClose}
            />
        </>
    );
});

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
