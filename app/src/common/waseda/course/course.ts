export type Course = {
    id: number;
};

export type CourseListItem = {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    isHidden: boolean;
    imageUrl: string;
    isFavorite: boolean;
    category: string;
};


export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type Term = 'spring_quarter' | 'summer_quarter' | 'fall_quarter' | 'winter_quarter' | 'spring_semester' | 'fall_semester' | 'full_year';
export type YearTerm = {
    year: number;
    term: Term;
};
export type DayPeriod = {
    day: DayOfWeek;
    period: {
        from: number;
        to: number; //inclusive
    };
};

export function termToString(term: Term): string {
    switch (term) {
        case 'spring_quarter':
            return browser.i18n.getMessage('springQuarter');
        case 'summer_quarter':
            return browser.i18n.getMessage('summerQuarter');
        case 'fall_quarter':
            return browser.i18n.getMessage('fallQuarter');
        case 'winter_quarter':
            return browser.i18n.getMessage('winterQuarter');
        case 'spring_semester':
            return browser.i18n.getMessage('springSemester');
        case 'fall_semester':
            return browser.i18n.getMessage('fallSemester');
        case 'full_year':
            return browser.i18n.getMessage('fullYear');
    }
}

export function yearTermToString(yearTerm: YearTerm): string {
    switch (yearTerm.term) {
        case 'spring_quarter':
            return browser.i18n.getMessage('year', yearTerm.year.toString()) + ' ' + browser.i18n.getMessage('springQuarter');
        case 'summer_quarter':
            return browser.i18n.getMessage('year', yearTerm.year.toString()) + ' ' + browser.i18n.getMessage('summerQuarter');
        case 'fall_quarter':
            return browser.i18n.getMessage('year', yearTerm.year.toString()) + ' ' + browser.i18n.getMessage('fallQuarter');
        case 'winter_quarter':
            return browser.i18n.getMessage('year', yearTerm.year.toString()) + ' ' + browser.i18n.getMessage('winterQuarter');
        case 'spring_semester':
            return browser.i18n.getMessage('year', yearTerm.year.toString()) + ' ' + browser.i18n.getMessage('springSemester');
        case 'fall_semester':
            return browser.i18n.getMessage('year', yearTerm.year.toString()) + ' ' + browser.i18n.getMessage('fallSemester');
        case 'full_year':
            return browser.i18n.getMessage('year', yearTerm.year.toString());
    }
}

export function yearTermEquals(a: YearTerm, b: YearTerm): boolean {
    return a.term === b.term && a.year === b.year;
}

export function dayPeriodEquals(a: DayPeriod, b: DayPeriod): boolean {
    return a.day === b.day && a.period.from === b.period.from && a.period.to === b.period.to;
}

const termFlags: { [key in Term]: number; } = {
    'spring_quarter': 0b0001,
    'summer_quarter': 0b0010,
    'fall_quarter': 0b0100,
    'winter_quarter': 0b1000,
    'spring_semester': 0b0011,
    'fall_semester': 0b1100,
    'full_year': 0b1111,
};
export function uniqueYearTerms(yearTerms: YearTerm[]): YearTerm[] {
    const map = new Map<number, Set<Term>>(); // year -> Term[]

    for (const yearTerm of yearTerms) {
        const set = map.get(yearTerm.year);
        if (set) {
            set.add(yearTerm.term);
        } else {
            map.set(yearTerm.year, new Set([yearTerm.term]));
        }
    }

    const uniqueYearTerms: YearTerm[] = [];
    for (const year of Array.from(map.keys()).sort((a, b) => a - b)) {
        const terms = map.get(year);
        if (!terms) throw Error('never');

        const hasFullYear = terms.has('full_year');
        const hasSpringSemester = terms.has('spring_semester');
        const hasFallSemester = terms.has('fall_semester');
        const hasSpringQuarter = terms.has('spring_quarter');
        const hasSummerQuarter = terms.has('summer_quarter');
        const hasFallQuarter = terms.has('fall_quarter');
        const hasWinterQuarter = terms.has('winter_quarter');

        if (!hasSpringQuarter && !hasSummerQuarter && (hasSpringSemester || (hasFallQuarter || hasWinterQuarter || hasFallSemester) && hasFullYear))
            uniqueYearTerms.push({ year, term: 'spring_semester' });
        if (hasSpringQuarter || hasSummerQuarter && (hasSpringSemester || hasFullYear))
            uniqueYearTerms.push({ year, term: 'spring_quarter' });
        if (hasSummerQuarter || hasSpringQuarter && (hasSpringSemester || hasFullYear))
            uniqueYearTerms.push({ year, term: 'summer_quarter' });
        if (!hasFallQuarter && !hasWinterQuarter && (hasFallSemester || (hasSpringQuarter || hasSummerQuarter || hasSpringSemester) && hasFullYear))
            uniqueYearTerms.push({ year, term: 'fall_semester' });
        if (hasFallQuarter || hasWinterQuarter && (hasFallSemester || hasFullYear))
            uniqueYearTerms.push({ year, term: 'fall_quarter' });
        if (hasWinterQuarter || hasFallQuarter && (hasFallSemester || hasFullYear))
            uniqueYearTerms.push({ year, term: 'winter_quarter' });
        if (!hasSpringQuarter && !hasSummerQuarter && !hasFallQuarter && !hasWinterQuarter && !hasSpringSemester && !hasFallSemester && hasFullYear)
            uniqueYearTerms.push({ year, term: 'full_year' });
    }

    return uniqueYearTerms;
}

export function containsYearTerm(container: YearTerm, containee: YearTerm): boolean {
    if (container.year !== containee.year) return false;
    return ((termFlags[container.term] & termFlags[containee.term]) === termFlags[containee.term]);
}

export function dayOfWeekToString(day: DayOfWeek): string {
    return browser.i18n.getMessage(day);
}
export function dayOfWeekToShortString(day: DayOfWeek): string {
    return browser.i18n.getMessage(day + 'Short');
}