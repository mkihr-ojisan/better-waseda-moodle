import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
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
