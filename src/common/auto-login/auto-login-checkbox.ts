import { ConfigKey, initConfig, setConfig } from "../config/config";

initConfig();

const CHECKBOX_ID = "bwm-auto-login-checkbox";

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (!(mutation.target instanceof HTMLElement)) continue;
        if (mutation.target.id === "idSIButton9") {
            addListenerToSignInButton(mutation.target);
        } else if (mutation.target.classList.contains("boilerplate-button-bottom")) {
            if (document.getElementById(CHECKBOX_ID)) return;
            insertCheckbox(mutation.target);
        }
    }
});
observer.observe(document.body, { attributes: true, subtree: true });

/**
 * 自動ログインを有効にするチェックボックスを挿入する
 *
 * @param elem - 挿入先の要素
 */
function insertCheckbox(elem: HTMLElement) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = CHECKBOX_ID;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = browser.i18n.getMessage("auto_login_checkbox");
    label.style.lineHeight = "1";
    label.style.whiteSpace = "nowrap";
    label.style.fontFamily = "sans-serif";
    label.style.fontSize = "0.85em";
    label.style.marginLeft = "0.5em";

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.marginBottom = "0.5em";
    container.appendChild(checkbox);
    container.appendChild(label);

    elem.insertAdjacentElement("afterbegin", container);
}

/**
 * サインインボタンにリスナーを追加する
 *
 * @param elem - サインインボタン
 */
function addListenerToSignInButton(elem: HTMLElement) {
    elem.addEventListener("click", onClickSignInButton);
}

/**
 * サインインボタンがクリックされたときの処理
 */
function onClickSignInButton() {
    const checkbox = document.getElementById(CHECKBOX_ID) as HTMLInputElement;
    if (checkbox.checked) {
        setConfig(ConfigKey.AutoLoginEnabled, true);
        setConfig(ConfigKey.LoginInfo, {
            userId: (document.querySelector("input[name=login]") as HTMLInputElement).value,
            password: (document.querySelector("input[name=passwd]") as HTMLInputElement).value,
        });
    }
}
