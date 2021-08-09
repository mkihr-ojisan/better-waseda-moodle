// #!debug
import 'react-devtools';

import React from 'react';
import ReactDOM from 'react-dom';
import { MessengerClient } from '../common/util/messenger';
import CourseOverview from './components/CourseOverview';
import { CourseListItem } from '../common/waseda/course/course';
import { initConfigCache } from '../common/config/config';

export const courseList = MessengerClient.exec('fetchCourseList') as Promise<CourseListItem[]>;
const initConfigCachePromise = initConfigCache();

window.addEventListener('DOMContentLoaded', async () => {
    // 本来のコース概要を隠す
    const elem = document.getElementsByClassName('block-myoverview')[0];
    if (elem instanceof HTMLElement) {
        elem.style.display = 'none';
    }

    const rootElement = document.createElement('div');
    rootElement.id = 'bwmCourseOverviewRoot';
    elem.insertAdjacentElement('afterend', rootElement);

    await initConfigCachePromise;

    ReactDOM.render(<CourseOverview />, rootElement);
});
