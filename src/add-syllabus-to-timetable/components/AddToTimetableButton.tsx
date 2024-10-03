import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
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
import {
    checkTimetableConflict,
    getTimetableData,
    mergeTimetableData,
    setTimetableData,
} from "@/common/course/timetable";
import CheckIcon from "@mui/icons-material/Check";

export const AddToTimetableButton: FC = () => {
    const [state, setState] = useState<"initial" | "not_added" | "adding" | "added" | "already_added">("initial");
    const [conflictDialogOpen, setConflictDialogOpen] = useState(false);

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
                    const courseKey = c.extra.wasedaId?.substring(4, 14);
                    return syllabus.courseInformation.courseKey === courseKey;
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

            if (isCustomCourse(course)) {
                setState("added");
                return;
            }

            const timetableData = getConfig(ConfigKey.TimetableData)[course.id];
            if (timetableData && timetableData.length > 0) {
                setState("already_added");
            } else {
                setState("not_added");
            }
        })();
    }, [syllabus.courseInformation.courseKey, syllabus.key]);

    const add = async () => {
        let cid;
        if (courseId.current) {
            cid = courseId.current;
        } else {
            cid = await call("addCustomCourse", {
                name: syllabus.courseInformation.courseTitle ?? "",
                url: location.href,
                hidden: false,
                courseKey: syllabus.courseInformation.courseKey ?? "",
            });
        }

        const timetableData = getTimetableDataFromSyllabus(syllabus);
        if (timetableData) {
            setTimetableData(mergeTimetableData(getTimetableData(), { [cid]: timetableData }));
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
    };

    const handleClick = async () => {
        setState("adding");

        const conflict = checkTimetableConflict({
            ...getTimetableData(),
            temp: getTimetableDataFromSyllabus(syllabus),
        });

        if (conflict) {
            setConflictDialogOpen(true);
            return;
        }

        await add();
        setState("added");
    };

    const handleContinue = async () => {
        setConflictDialogOpen(false);
        await add();
        setState("added");
    };

    const handleCancel = () => {
        setConflictDialogOpen(false);
        setState("not_added");
    };

    return state === "initial" ? null : (
        <>
            <Button
                variant="outlined"
                startIcon={state === "not_added" || state === "adding" ? <AddIcon /> : <CheckIcon />}
                sx={{ margin: 1 }}
                disabled={state !== "not_added"}
                onClick={handleClick}
            >
                {browser.i18n.getMessage(`add_syllabus_to_timetable_button_${state}`)}
            </Button>
            <Dialog open={conflictDialogOpen} onClose={handleCancel}>
                <DialogContent>
                    <DialogContentText>
                        {browser.i18n.getMessage("add_syllabus_to_timetable_conflict_dialog_message")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        {browser.i18n.getMessage("cancel")}
                    </Button>
                    <Button onClick={handleContinue} color="primary">
                        {browser.i18n.getMessage("add_syllabus_to_timetable_conflict_dialog_continue")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
