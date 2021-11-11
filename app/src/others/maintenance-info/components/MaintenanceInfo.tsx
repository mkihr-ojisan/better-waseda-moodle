import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import React, { useCallback } from 'react';
import { format } from '../../../common/util/date';
import { MaintenanceInfo } from '../../../common/waseda/maintenance-info';

export type MaintenanceInfoProps = {
    info: MaintenanceInfo;
};

const useStyles = makeStyles(() => ({
    alertAction: {
        alignItems: 'center',
    },
}));

export default React.memo(function MaintenanceInfo(props: MaintenanceInfoProps) {
    const classes = useStyles();

    const startTimeString = format(props.info.startTime, browser.i18n.getMessage('maintenanceSpanFormat'));
    const endTimeString =
        (props.info.endTime && format(props.info.endTime, browser.i18n.getMessage('maintenanceSpanFormat'))) ?? '';

    const onDetailClick = useCallback(() => {
        window.open(props.info.detailUrl, '_blank');
    }, [props.info.detailUrl]);

    return (
        <>
            <Alert
                severity="warning"
                variant="outlined"
                classes={{ action: classes.alertAction }}
                action={
                    props.info.detailUrl && (
                        <Button onClick={onDetailClick} color="inherit" size="small">
                            {browser.i18n.getMessage('maintenanceDetail')}
                        </Button>
                    )
                }
            >
                <AlertTitle>{browser.i18n.getMessage('maintenanceInfo')}</AlertTitle>
                {browser.i18n.getMessage(props.info.message.messageName, props.info.message.substitutions ?? [])}
                {browser.i18n.getMessage('maintenanceSpan', [startTimeString, endTimeString])}
            </Alert>
        </>
    );
});
