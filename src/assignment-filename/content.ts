import { ConfigKey, getConfig, initConfig } from "@/common/config/config";

window.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.src = browser.runtime.getURL("assignment-filename/inject.js");

    const promise = (async () => {
        await initConfig();

        const template = getConfig(ConfigKey.AssignmentFilenameTemplate);

        const courseLink = document.querySelector(
            '.breadcrumb a[href^="https://wsdmoodle.waseda.jp/course/view.php?id="]'
        ) as HTMLAnchorElement | null;

        const courseId = new URL(courseLink?.href ?? "").searchParams.get("id");

        // 上書きされた科目名、または元の科目名
        let course;
        if (courseId) {
            course = getConfig(ConfigKey.CourseNameOverrides)[courseId] ?? courseLink?.title;
        }

        return {
            template,
            formatArgs: {
                course,
                assignment: document.getElementsByTagName("h1")[0]?.textContent?.trim(),
            },
        };
    })();

    script.onload = async () => {
        const { template, formatArgs } = await promise;

        // inject.jsにtemplateとformatArgsを渡す
        window.postMessage({
            "assignment-filename-template": template,
            "assignment-filename-format-args": formatArgs,
        });
    };

    document.head.appendChild(script);
});
