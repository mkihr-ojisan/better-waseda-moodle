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
export type Quarter = 'spring' | 'summer' | 'fall' | 'winter';
export type Term = {
    year: number;
    quarters: Quarter[];
};
export type DayPeriod = {
    day: DayOfWeek;
    period: {
        from: number;
        to: number; //inclusive
    };
};

export type CourseRegistrationInfo = {
    yearTerm: Term;
    dayPeriod: DayPeriod[];
    syllabusUrl: string;
};