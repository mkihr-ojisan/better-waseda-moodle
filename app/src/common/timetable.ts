import { getConfig, setConfig } from './config/config';
import { DayPeriod, YearTerm } from './course';

export type TimetableEntry = [
    id: number,
    data: {
        term: YearTerm;
        dayPeriod: DayPeriod;
    }[],
];

export async function registerTimetableEntry(entry: TimetableEntry): Promise<void> {
    //高々数百個しかないので多少効率悪くてもいいやという考え
    const entries = await getConfig('timetable.entries');
    const index = entries.findIndex(e => e[0] === entry[0]);

    if (entry[1].length === 0) {
        if (index !== -1) {
            entries.splice(index, 1);
            await setConfig('timetable.entries', entries);
        }
    } else {
        if (index === -1) {
            entries.push(entry);
        } else {
            entries[index] = entry;
        }
        await setConfig('timetable.entries', entries);
    }

}

