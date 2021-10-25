// #!debug
import 'react-devtools';

import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './components/Popup';
import { initConfigCache } from '../common/config/config';

(async () => {
    await initConfigCache();

    ReactDOM.render(<Popup />, document.getElementById('container'));
})();
