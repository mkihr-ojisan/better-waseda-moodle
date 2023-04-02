import { fetchWithCredentials } from "@/common/util/fetch";
import { launchMyWaseda } from "./pages/my-waseda";
import { launchGradeInquiry } from "./pages/grade-inquiry";
import { launchCourseRegistration } from "./pages/course-registration";
import { launchWasedaEmail } from "./pages/waseda-email";
import { launchGradeAndCourseRegistration } from "./pages/grade-and-course-registration";

document.title = browser.i18n.getMessage("launcher_title");

const target = new URLSearchParams(window.location.search).get("target");
switch (target) {
    case "my_waseda":
        launchMyWaseda();
        break;
    case "grade_and_course_registration":
        launchGradeAndCourseRegistration();
        break;
    case "course_registration":
        launchCourseRegistration();
        break;
    case "grade_inquiry":
        launchGradeInquiry();
        break;
    case "waseda_email":
        launchWasedaEmail();
        break;
    default:
        throw new Error(`Unknown target: ${target}`);
}

/**
 * WindowIdなる謎の値を取得する
 */
export async function fetchWindowId(): Promise<string> {
    return (await fetchWithCredentials("https://my.waseda.jp/dummy/dummy-subsession!getNewWindowId")).text();
}

/**
 * ウィンドウ内でフォームを送信する
 *
 * @param form - 送信するフォーム
 * @param action - 送信先
 */
export function postFormInWindow(form: Record<string, string>, action: string): void {
    const formElement = document.createElement("form");
    formElement.method = "POST";
    formElement.action = action;

    for (const key of Object.keys(form)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = form[key];
        formElement.appendChild(input);
    }

    document.body.appendChild(formElement);
    formElement.submit();
}
