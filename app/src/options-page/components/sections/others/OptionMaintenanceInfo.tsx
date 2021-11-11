import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import React, { useCallback } from 'react';
import useConfig from '../../../../common/react/useConfig';
import { MAINTENANCE_INFO_ORIGIN } from '../../../../common/waseda/maintenance-info';

const useStyles = makeStyles(() => ({
    listItemRoot: {
        paddingRight: 70,
    },
}));

export default React.memo(function OptionMaintenanceInfo() {
    const [value, setValue] = useConfig('maintenanceInfo.enabled');

    const classes = useStyles();

    const handleClick = useCallback(async () => {
        if (value) {
            await browser.permissions.remove({ origins: [MAINTENANCE_INFO_ORIGIN] });
        } else {
            const granted = await browser.permissions.request({
                origins: [MAINTENANCE_INFO_ORIGIN],
            });
            if (!granted) {
                return;
            }
        }
        setValue(!value);
    }, [setValue, value]);

    return (
        <ListItem button onClick={handleClick} classes={{ root: classes.listItemRoot }}>
            <ListItemText
                disableTypography
                primary={
                    <Typography variant="body1" color="textPrimary">
                        {browser.i18n.getMessage('optionsMaintenanceInfo')}
                    </Typography>
                }
                secondary={
                    <Typography variant="body2" color="textSecondary">
                        {browser.i18n.getMessage('optionsMaintenanceInfoDescription', MAINTENANCE_INFO_ORIGIN)}
                    </Typography>
                }
            />
            <ListItemSecondaryAction>
                <Switch checked={value} onClick={handleClick} />
            </ListItemSecondaryAction>
        </ListItem>
    );
});
