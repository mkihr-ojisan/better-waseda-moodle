import { CourseProvider } from "../course";

export type CustomCourse = {
    readonly id: string;
    readonly name: string;
    readonly url: string | undefined;
    readonly imageUrl: string | undefined;
};

export const customCourseProvider: CourseProvider = (() => {
    throw new Error("Not implemented");
})();
