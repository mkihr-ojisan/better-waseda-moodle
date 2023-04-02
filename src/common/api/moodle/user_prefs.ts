import { callMoodleAPI } from "./moodle";

/**
 * Moodleのユーザー設定を更新する。
 *
 * @param preferences - 更新する設定
 */
export async function core_user_update_user_preferences(
    preferences: { type: string; value: unknown }[]
): Promise<void> {
    await callMoodleAPI([
        {
            args: { preferences },
            methodname: "core_user_update_user_preferences",
        },
    ]);
}

/**
 * 指定したコースの非表示設定を更新する。
 *
 * @param courseId - コースID
 * @param hidden - 非表示にするかどうか
 */
export async function set_block_myoverview_hidden_course(courseId: number, hidden: boolean): Promise<void> {
    await core_user_update_user_preferences([
        {
            type: `block_myoverview_hidden_course_${courseId}`,
            value: hidden ? true : null,
        },
    ]);
}
