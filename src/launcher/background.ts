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

/**
 * actionのコンテキストメニューから各ページを開く機能を初期化する。
 */
export function initLauncher(): void {
    browser.contextMenus.onClicked.addListener((info: browser.contextMenus.OnClickData) => {
        if (info.menuItemId in menus) {
            browser.tabs.create({ url: menus[info.menuItemId] });
        }
    });

    browser.runtime.onInstalled.addListener(() => {
        [
            "launcher_better_waseda_moodle_settings",
            "launcher_waseda_moodle",
            "launcher_my_waseda",
            "launcher_syllabus_search",
        ].map((id) => {
            browser.contextMenus.create({
                id,
                title: browser.i18n.getMessage(id),
                contexts: ["action"],
            });
        });

        browser.contextMenus.create({
            id: "grade_and_course_registration",
            title: browser.i18n.getMessage("launcher_grade_and_course_registration"),
            contexts: ["action"],
        });

        browser.contextMenus.create({
            id: "launcher_grade_and_course_registration",
            title: browser.i18n.getMessage("launcher_grade_and_course_registration"),
            contexts: ["action"],
            parentId: "grade_and_course_registration",
        });
        browser.contextMenus.create({
            id: "separator",
            type: "separator",
            contexts: ["action"],
            parentId: "grade_and_course_registration",
        });
        ["launcher_course_registration", "launcher_grade_inquiry", "launcher_waseda_email"].map((id) => {
            browser.contextMenus.create({
                id,
                title: browser.i18n.getMessage(id),
                contexts: ["action"],
                parentId: "grade_and_course_registration",
            });
        });
    });
}
