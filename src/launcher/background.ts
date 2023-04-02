/**
 *
 */
export function initLauncher(): void {
    const menus: Record<string, string> = {
        launcher_better_waseda_moodle_settings: browser.runtime.getURL("options-page/options-page.html"),
        launcher_waseda_moodle: "https://wsdmoodle.waseda.jp/my/",
        launcher_my_waseda: browser.runtime.getURL("launcher/launcher.html?target=my_waseda"),
        launcher_syllabus_search: "https://www.wsl.waseda.jp/syllabus/JAA101.php",
        launcher_grade_and_course_registration: browser.runtime.getURL(
            "launcher/launcher.html?target=grade_and_course_registration"
        ),
        launcher_course_registration: browser.runtime.getURL("launcher/launcher.html?target=course_registration"),
        launcher_grade_inquiry: browser.runtime.getURL("launcher/launcher.html?target=grade_inquiry"),
        launcher_waseda_email: browser.runtime.getURL("launcher/launcher.html?target=waseda_email"),
    };

    const onclick = (info: browser.contextMenus.OnClickData) => {
        if (info.menuItemId in menus) {
            browser.tabs.create({ url: menus[info.menuItemId] });
        }
    };
    [
        "launcher_better_waseda_moodle_settings",
        "launcher_waseda_moodle",
        "launcher_my_waseda",
        "launcher_syllabus_search",
    ].map((id) => {
        browser.contextMenus.create({
            id,
            title: browser.i18n.getMessage(id),
            contexts: ["browser_action"],
            onclick,
        });
    });

    browser.contextMenus.create({
        id: "grade_and_course_registration",
        title: browser.i18n.getMessage("launcher_grade_and_course_registration"),
        contexts: ["browser_action"],
    });

    browser.contextMenus.create({
        id: "launcher_grade_and_course_registration",
        title: browser.i18n.getMessage("launcher_grade_and_course_registration"),
        contexts: ["browser_action"],
        parentId: "grade_and_course_registration",
        onclick,
    });
    browser.contextMenus.create({
        type: "separator",
        contexts: ["browser_action"],
        parentId: "grade_and_course_registration",
    });
    ["launcher_course_registration", "launcher_grade_inquiry", "launcher_waseda_email"].map((id) => {
        browser.contextMenus.create({
            id,
            title: browser.i18n.getMessage(id),
            contexts: ["browser_action"],
            parentId: "grade_and_course_registration",
            onclick,
        });
    });
}
