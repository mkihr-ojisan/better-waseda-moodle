import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import Action from '../../options/Action';
import HiddenToDoItemDialog from './HiddenToDoItemDialog';

export default React.memo(function HiddenToDoItems() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpen = useCallback(() => {
        setDialogOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setDialogOpen(false);
    }, []);

    return (
        <>
            <Action
                message="optionsHiddenToDoItemDialogTitle"
                buttonMessage="optionsHiddenToDoItemsButton"
                onClick={handleOpen}
            />
            <HiddenToDoItemDialog open={dialogOpen} onClose={handleClose} />
        </>
    );
});
