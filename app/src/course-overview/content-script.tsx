// #!debug
import 'react-devtools';

import React from 'react';
import ReactDOM from 'react-dom';
import { MessengerClient } from '../common/util/messenger';
import CourseOverview from './components/CourseOverview';
import { CourseListItem } from '../common/waseda/course/course';
import { getConfig } from '../common/config/config';

export const messengerClient = new MessengerClient();

export const courseList = messengerClient.exec('fetchCourseList') as Promise<CourseListItem[]>;
export const timetableEntries = getConfig('timetable.entries');
export const courseData = getConfig('courseData');

window.addEventListener('DOMContentLoaded', async () => {
    // 本来のコース概要を隠す
    const elem = document.getElementsByClassName('block-myoverview')[0];
    if (elem instanceof HTMLElement) {
        elem.style.display = 'none';
    }

    const rootElement = document.createElement('div');
    rootElement.id = 'bwmCourseOverviewRoot';
    elem.insertAdjacentElement('afterend', rootElement);

    ReactDOM.render(
        <CourseOverview />,
        rootElement,
    );
});
