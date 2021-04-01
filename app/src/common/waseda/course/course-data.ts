import { getConfig, setConfig } from '../../config/config';
import { DayPeriod, YearTerm } from './course';

export type CourseDataEntry = {
    overrideName?: string;
    overrideImage?: CourseImage;
    timetableData?: TimetableEntry[];
};

export type CourseImage = CourseImageUrl | CourseImageSolidColor;
export type CourseImageUrl = {
    type: 'url';
    url: string;
};
export type CourseImageSolidColor = {
    type: 'solid_color';
    r: number;
    g: number;
    b: number;
};

export type TimetableEntry = {
    yearTerm: YearTerm;
    dayPeriod: DayPeriod;
};

export async function registerCourseData<T extends keyof CourseDataEntry>(courseId: number, key: T, value: CourseDataEntry[T]): Promise<void> {
    const configValue = await getConfig('courseData');

    const entry = configValue[courseId] ?? (configValue[courseId] = {});
    entry[key] = value;

    await setConfig('courseData', configValue);
}