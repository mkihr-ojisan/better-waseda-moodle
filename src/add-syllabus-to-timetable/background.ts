import { ConfigKey } from "@/common/config/config";
import registerContentScript from "@/common/config/registerContentScript";

/**
 * シラバスから時間割に科目を追加する機能を初期化する
 */
export function initAddSyllabusToTimetable(): void {
    registerContentScript(ConfigKey.CourseOverviewEnabled, {
        js: [{ file: "add-syllabus-to-timetable/content.js" }],
        runAt: "document_end",
        matches: ["https://www.wsl.waseda.jp/syllabus/JAA104.php?*"],
    });
}
