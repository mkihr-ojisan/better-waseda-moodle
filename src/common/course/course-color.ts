import { assertExtensionContext } from "../util/context";
import { MoodleCourse } from "./provider/moodle";

export const DEFAULT_COURSE_COLOR = "#808080";

/**
 * CourseCardに表示する色のデフォルト値を取得する。
 * Moodle上で設定されている科目の画像の全ピクセルの平均の色。
 *
 * @param course - 色を取得する科目
 * @returns 色 (#RRGGBB)
 */
export async function getCourseColor(course: MoodleCourse): Promise<string> {
    assertExtensionContext(["content_script", "extension_page"]); // DOM APIを使っているので

    if (!course.courseImageUrl) {
        return DEFAULT_COURSE_COLOR;
    }

    const img = document.createElement("img");
    img.crossOrigin = "use-credentials";
    img.src = course.courseImageUrl;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw Error("failed to create canvas context");

    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;

    // 全ピクセルの平均を取る
    const sum = [0, 0, 0];
    for (let i = 0; i < data.length; i += 4) {
        sum[0] += data[i];
        sum[1] += data[i + 1];
        sum[2] += data[i + 2];
    }
    const avg = [
        Math.round(sum[0] / (img.width * img.height)),
        Math.round(sum[1] / (img.width * img.height)),
        Math.round(sum[2] / (img.width * img.height)),
    ];

    const color =
        "#" +
        avg[0].toString(16).padStart(2, "0") +
        avg[1].toString(16).padStart(2, "0") +
        avg[2].toString(16).padStart(2, "0");

    return color;
}
