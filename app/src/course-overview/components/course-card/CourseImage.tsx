import CardMedia from '@mui/material/CardMedia';
import React, { ReactElement, useContext } from 'react';
import { CourseListItem } from '../../../common/waseda/course/course';
import { CourseOverviewContext } from './../CourseOverview';

type Props = {
    course: CourseListItem;
    title: string;
    alt: string;
    height: string;
    classes?: { cardMediaRoot?: string };
};

export default React.memo(function CourseImage(props: Props): ReactElement {
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
                        classes={{ root: props.classes?.cardMediaRoot }}
                    />
                );
            case 'solid_color':
                backgroundColor = `rgb(${overrideCourseImage.r}, ${overrideCourseImage.g}, ${overrideCourseImage.b})`;
                return (
                    <CardMedia
                        title={props.title}
                        style={{ height: props.height + 'px', backgroundColor }}
                        component="div"
                        classes={{ root: props.classes?.cardMediaRoot }}
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
                classes={{ root: props.classes?.cardMediaRoot }}
            />
        );
    }
});
