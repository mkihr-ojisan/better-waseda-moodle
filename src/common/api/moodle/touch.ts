import { assertExtensionContext } from "../../../common/util/context";
import { callMoodleAPI } from "./moodle";

assertExtensionContext("background");

/** Waseda Moodleのセッションを維持する。 */
export async function core_session_touch(): Promise<void> {
    await callMoodleAPI([{ methodname: "core_session_touch", args: {} }]);
}
