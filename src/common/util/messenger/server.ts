import { fetchCourses, setCourseHidden } from "@/common/course/course";
import { doAutoLogin } from "../../../common/auto-login/auto-login";
import { assertExtensionContext } from "../context";
import { core_session_touch } from "@/common/api/moodle/touch";
import { fetchMoodleTimeline } from "@/common/timeline/timeline";
import { setSessionKeyCache } from "@/common/auto-login/session-key-cache";
import { fetchMoodleCourses } from "@/common/course/provider/moodle";
import { addCustomCourse, deleteCustomCourse } from "@/common/course/provider/custom";
import { core_webservice_get_site_info } from "@/common/api/moodle/core_webservice";
import { callMoodleAPI } from "@/common/api/moodle/moodle";
import { callMoodleMobileAPI } from "@/common/api/moodle/mobileAPI";
import { core_course_get_contents } from "@/common/api/moodle/core_course";
import { updateBadge } from "@/popup/badge";
import { errorToString } from "@/common/error";
import { collectSyllabusInformation } from "@/common/course/collect-syllabus-information";
import { getEnrollmentYear } from "@/common/user/user";

assertExtensionContext("background");

/**
 * `MessengerServer`が実行できる関数を定義する。
 * 返り値として利用できるのは、Web Messaging APIで送受信できる値、またはそれを返すPromise、AsyncGenerator。
 */
export const messengerCommands = {
    ping: () => undefined,
    doAutoLogin,
    fetchCourses,
    invalidateCourseCache: fetchCourses.invalidateCache,
    setCourseHidden,
    collectSyllabusInformation,
    core_session_touch,
    fetchMoodleTimeline,
    invalidateMoodleTimelineCache: fetchMoodleTimeline.invalidateCache,
    setSessionKeyCache,
    fetchMoodleCourses,
    addCustomCourse,
    deleteCustomCourse,
    core_webservice_get_site_info,
    callMoodleAPI,
    callMoodleMobileAPI,
    core_course_get_contents,
    updateBadge,
    getEnrollmentYear,
} as const satisfies Record<string, (...args: any[]) => any>;

export type MessengerMessage<T extends keyof typeof messengerCommands> =
    | {
          command: T;
          args: Parameters<(typeof messengerCommands)[T]>;
      }
    | {
          generatorNext: { id: string; value: any };
      };

export type MessengerResponse<T extends keyof typeof messengerCommands> =
    | {
          ret: { value: Awaited<ReturnType<(typeof messengerCommands)[T]>> };
      }
    | {
          error: string;
      }
    | {
          generator: { id: string };
      }
    | {
          generatorNext: { value: any; done: boolean };
      };

/**
 * `MessengerServer`を初期化する。バックグラウンドスクリプト上で実行する。
 *
 * @param initPromise - バックグラウンドスクリプトの初期化処理が完了したときに解決されるPromise
 */
export function initMessengerServer(initPromise: Promise<void>): void {
    const generators = new Map<string, AsyncGenerator<any, any, any>>();

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        (async () => {
            await initPromise;

            if (typeof message !== "object" || message === null) {
                throw new Error("Invalid message");
            }

            if ("command" in message) {
                const command = message.command as keyof typeof messengerCommands;
                const args = message.args as Parameters<(typeof messengerCommands)[typeof command]>;

                try {
                    const result = await (messengerCommands[command] as any)(...args);

                    if (isAsyncGenerator(result)) {
                        const id = Math.random().toString(36).slice(2);
                        generators.set(id, result);
                        sendResponse({ generator: { id } });
                    } else {
                        sendResponse({ ret: { value: result } });
                    }
                } catch (error) {
                    sendResponse({ error: errorToString(error) });
                }
            } else if ("generatorNext" in message) {
                const id = message.generatorNext.id as string;
                const generator = generators.get(id);
                if (!generator) {
                    throw new Error("Invalid generator ID");
                }

                try {
                    const { value, done } = await generator.next(message.generatorNext.value);
                    if (done) {
                        generators.delete(id);
                    }

                    sendResponse({ generatorNext: { value, done } });
                } catch (error) {
                    sendResponse({ error: errorToString(error) });
                }
            }
        })();

        return true;
    });
}

/**
 * valueがGeneratorかAsyncGeneratorかどうかを判定する。
 *
 * @param value - 判定する値
 * @returns valueがGeneratorかAsyncGeneratorの場合true、そうでない場合false
 */
function isAsyncGenerator<T>(value: any): value is AsyncGenerator<T, any, any> {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof value.next === "function" &&
        typeof value.return === "function" &&
        typeof value.throw === "function" &&
        typeof value[Symbol.asyncIterator] === "function"
    );
}
