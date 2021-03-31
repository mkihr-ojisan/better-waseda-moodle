import CardMedia from '@material-ui/core/CardMedia';
import React, { ReactElement, useContext } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import { CourseOverviewContext } from './CourseOverview';

type Props = {
    course: CourseListItem;
    title: string;
    alt: string;
    height: string;
};


export default function CourseImage(props: Props): ReactElement {
    const context = useContext(CourseOverviewContext);

    const overrideCourseImage = context.courseData[props.course.id]?.overrideImage;

    let backgroundColor;
    if (overrideCourseImage) {
        switch (overrideCourseImage.type) {
            case 'url':
                return (
                    <CardMedia
                        title={props.title}
                        alt={props.alt}
                        height={props.height}
                        component="img"
                        image={overrideCourseImage.url}
                    />
                );
            case 'solid_color':
                backgroundColor = `rgb(${overrideCourseImage.r}, ${overrideCourseImage.g}, ${overrideCourseImage.b})`;
                return (
                    <CardMedia
                        title={props.title}
                        style={{ height: props.height + 'px', backgroundColor }}
                        component="div"
                    />
                );
        }
    } else {
        return (
            <CardMedia
                title={props.title}
                alt={props.alt}
                height={props.height}
                component="img"
                image={props.course.imageUrl}
            />
        );
    }
}