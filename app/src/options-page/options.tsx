// #!debug
import 'react-devtools';

import React from 'react';
import ReactDOM from 'react-dom';
import Options from './components/Options';
import { initConfigCache } from '../common/config/config';

(async () => {
    await initConfigCache();

    ReactDOM.render(<Options />, document.getElementById('container'));
})();
