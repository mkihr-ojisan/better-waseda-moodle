import { fetchCourses, setCourseHidden } from "@/common/course/course";
import { doAutoLogin } from "../../../common/auto-login/auto-login";
import { assertExtensionContext } from "../context";
import { collectSyllabusInformation } from "@/common/course/collect-syllabus-information";
import { getConstants } from "@/common/constants/constants";
import { core_session_touch } from "@/common/api/moodle/touch";
import { fetchMoodleTimeline } from "@/common/timeline/timeline";
import { serializeError } from "@/common/error";
import { setSessionKeyCache } from "@/common/auto-login/session-key-cache";

assertExtensionContext("background");

/**
 * `MessengerServer`が実行できる関数を定義する。
 * 返り値として利用できるのは、Web Messaging APIで送受信できる値、またはそれを返すPromise、Generator、AsyncGenerator。
 */
export const messengerCommands = {
    doAutoLogin,
    fetchCourses,
    invalidateCourseCache: fetchCourses.invalidateCache,
    setCourseHidden,
    collectSyllabusInformation,
    getConstants,
    core_session_touch,
    fetchMoodleTimeline,
    invalidateMoodleTimelineCache: fetchMoodleTimeline.invalidateCache,
    setSessionKeyCache,
} as const satisfies Record<string, (...args: any[]) => any>;

/** `MessengerServer`を初期化する。バックグラウンドスクリプト上で実行する。 */
export function initMessengerServer(): void {
    browser.runtime.onConnect.addListener((port) => {
        let disconnected = false;
        const iterators: Map<string, Generator | AsyncGenerator> = new Map();
        port.onMessage.addListener(async (message: any) => {
            if ("command" in message) {
                const id: string = message.id;
                const command: string = message.command;
                const args: any[] = message.args;

                const func = messengerCommands[command as keyof typeof messengerCommands] as any;

                let result;
                try {
                    result = await func(...args);

                    if (typeof result === "object" && "next" in result && typeof result.next === "function") {
                        const iterator = result;
                        iterators.set(id, iterator);
                        if (!disconnected) port.postMessage({ id, iter: null });
                    } else {
                        if (!disconnected) port.postMessage({ id, ret: { value: result } });
                    }
                } catch (error) {
                    if (!disconnected)
                        port.postMessage({
                            id,
                            error: serializeError(error),
                        });
                }
            } else if ("iter_next" in message) {
                const id: string = message.id;
                const iterator = iterators.get(id);

                if (!iterator) {
                    console.warn("iterator not found");
                    return;
                }

                let result;
                try {
                    result = await iterator.next(message.iter_next.value);
                } catch (error) {
                    if (!disconnected)
                        port.postMessage({
                            id,
                            error: serializeError(error),
                        });
                    return;
                }

                if (result.done) {
                    iterators.delete(id);
                }

                if (!disconnected) port.postMessage({ id, iter_next: { value: result } });
            } else {
                console.warn("invalid message", message);
            }
        });
        port.onDisconnect.addListener(() => {
            disconnected = true;
        });
    });
}
