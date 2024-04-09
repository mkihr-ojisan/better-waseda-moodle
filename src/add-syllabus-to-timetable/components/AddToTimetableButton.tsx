import { Button } from "@mui/material";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { call } from "@/common/util/messenger/client";
import { isCustomCourse, isMoodleCourse } from "@/common/course/course-provider-type-guard";
import {
    getCourseDeliveryMethodFromSyllabus,
    getTimetableDataFromSyllabus,
    parseSyllabus,
} from "@/common/api/waseda/syllabus";
import { ConfigKey, getConfig, setConfig } from "@/common/config/config";
import { getTimetableData, setTimetableData } from "@/common/course/timetable";
import CheckIcon from "@mui/icons-material/Check";

export const AddToTimetableButton: FC = () => {
    const [state, setState] = useState<"initial" | "not_added" | "adding" | "added" | "already_added">("initial");

    const syllabus = useMemo(() => {
        const key = new URLSearchParams(location.search).get("pKey");
        if (!key) throw new Error("pKey not found");
        return parseSyllabus(key, document);
    }, []);

    const courseId = useRef<string | null>(null);

    useEffect(() => {
        (async () => {
            const { value: courses, done } = await (await call("fetchCourses")).next();
            if (done) throw new Error("unexpected end of iterator");

            const course = courses.find((c) => {
                if (isMoodleCourse(c)) {
                    const courseCode = c.extra.wasedaId?.substring(4, 14);
                    return syllabus.courseInformation.courseCode === courseCode;
                } else if (isCustomCourse(c)) {
                    const syllabusKey = getConfig(ConfigKey.CourseSyllabusKeys)[c.id];
                    return syllabusKey === syllabus.key;
                }
            });
            if (!course) {
                setState("not_added");
                return;
            }

            courseId.current = course.id;

            const timetableData = getConfig(ConfigKey.TimetableData)[course.id];
            if (timetableData && timetableData.length > 0) {
                setState("already_added");
            } else {
                setState("not_added");
            }
        })();
    }, [syllabus.courseInformation.courseCode, syllabus.key]);

    const handleClick = async () => {
        let cid;
        if (courseId.current) {
            cid = courseId.current;
        } else {
            cid = await call("addCustomCourse", {
                name: syllabus.courseInformation.courseTitle ?? "",
                url: location.href,
                hidden: false,
            });
        }

        const timetableData = getTimetableDataFromSyllabus(syllabus);
        if (timetableData) {
            setTimetableData({
                ...getTimetableData(),
                [cid]: timetableData,
            });
        }

        setConfig(ConfigKey.CourseSyllabusKeys, {
            ...getConfig(ConfigKey.CourseSyllabusKeys),
            [cid]: syllabus.key,
        });

        const classDeliveryMethod = getCourseDeliveryMethodFromSyllabus(syllabus);
        if (classDeliveryMethod) {
            setConfig(ConfigKey.CourseDeliveryMethods, {
                ...getConfig(ConfigKey.CourseDeliveryMethods),
                [cid]: classDeliveryMethod,
            });
        }

        setState("added");
    };

    return state === "initial" ? null : (
        <Button
            variant="outlined"
            startIcon={state === "not_added" ? <AddIcon /> : <CheckIcon />}
            sx={{ margin: 1 }}
            disabled={state !== "not_added"}
            onClick={handleClick}
        >
            {browser.i18n.getMessage(`add_syllabus_to_timetable_button_${state}`)}
        </Button>
    );
};
