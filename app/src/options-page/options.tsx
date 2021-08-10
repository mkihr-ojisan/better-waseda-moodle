// #!debug
import 'react-devtools';

import React from 'react';
import ReactDOM from 'react-dom';
import { initConfigCache } from '../common/config/config';
import OptionsPage from './components/OptionsPage';

document.title = browser.i18n.getMessage('optionsPageTitle');

(async () => {
    await initConfigCache();

    ReactDOM.render(<OptionsPage />, document.getElementById('container'));
})();
