import Box from '@mui/material/Box';
import React from 'react';
import ReactDOM from 'react-dom';
import BWMRoot from '../../common/react/BWMRoot';
import { fetchMaintenanceInfo } from '../../common/waseda/maintenance-info';
import MaintenanceInfo from './components/MaintenanceInfo';

(async () => {
    const root = document.createElement('div');
    document.querySelector('#page-content h5')?.insertAdjacentElement('beforebegin', root);

    const now = Date.now();
    const maintenances = (await fetchMaintenanceInfo()).filter(
        (item) =>
            item.startTime.getTime() - now < 7 * 24 * 60 * 60 * 1000 /* 1週間後のまで表示する */ &&
            (!item.endTime || item.endTime.getTime() - now > 0)
    );
    ReactDOM.render(
        <BWMRoot>
            <Box pb={2}>
                {maintenances.map((item) => (
                    <MaintenanceInfo info={item} />
                ))}
            </Box>
        </BWMRoot>,
        root
    );
})();
