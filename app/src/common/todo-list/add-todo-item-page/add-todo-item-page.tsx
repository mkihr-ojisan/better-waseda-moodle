import React from 'react';
import ReactDOM from 'react-dom';
import { initConfigCache } from '../../config/config';
import { OpenAddToDoItemPageOptions } from '../todo';
import AddToDoItemPage from './components/AddToDoItemPage';

document.title = browser.i18n.getMessage('addToDoItemPageTitle');

(async () => {
    await initConfigCache();

    const query = decodeURIComponent(location.search.substring(1));

    const options = query ? (JSON.parse(query) as OpenAddToDoItemPageOptions) : {};

    ReactDOM.render(<AddToDoItemPage {...options} />, document.getElementById('container'));
})();
