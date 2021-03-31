export type CourseData = {
    overrideName?: string;
    overrideImage?: CourseImage;
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