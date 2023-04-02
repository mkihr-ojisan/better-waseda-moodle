import { checkSessionKey } from "@/common/api/moodle/checkSessionKey";
import { ConfigKey, getConfig, initConfig } from "@/common/config/config";
import { BWMRoot } from "@/common/react/root";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import React, { FC } from "react";
import { createRoot } from "react-dom/client";
import ReactMarkdown from "react-markdown";

/** 小テスト・フォーラム・課題の提出前にセッションが生きているか確認する機能 */
(async () => {
    await initConfig();
    if (!getConfig(ConfigKey.CheckSessionEnabled)) return;

    document.addEventListener(
        "click",
        (event) => {
            let elem = event.target as HTMLElement | null;
            while (elem && elem !== document.body) {
                if (
                    elem.classList.contains("mod_quiz-next-nav") ||
                    elem.id === "id_submitbutton" ||
                    elem.getAttribute("data-action") === "forum-inpage-submit"
                ) {
                    return onClickSubmitButton(event, elem);
                }

                elem = elem.parentElement;
            }
        },
        true
    );

    const rootElem = document.createElement("div");
    document.body.appendChild(rootElem);
    const root = createRoot(rootElem);

    let allowSubmit = false; // セッション確認後に普通にクリックイベントが起こるようにするためのフラグ
    let checkingSession = false; // セッション確認中かどうか
    let buttonText: string | Element[] = ""; // セッション確認後にボタンのテキストを戻すために保存しておく変数

    const onClickSubmitButton = (event: MouseEvent, button: HTMLElement): void => {
        if (allowSubmit) return;
        if (checkingSession) {
            // セッション確認中に再度クリックされても何もしない
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const sessionKey = document
            .querySelector('a[href^="https://wsdmoodle.waseda.jp/login/logout.php?sesskey="]')
            ?.getAttribute("href")
            ?.match(/sesskey=(.*)$/)?.[1];

        if (!sessionKey) {
            console.warn("cannot find session key...");
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        checkingSession = true;

        // ボタンの中身を保存しておき、テキストを変更する
        if (button instanceof HTMLInputElement) {
            buttonText = button.value;
            button.value = browser.i18n.getMessage("check_session_checking");
        } else {
            buttonText = Array.from(button.children);
            button.innerText = browser.i18n.getMessage("check_session_checking");
        }

        checkSessionKey(sessionKey).then((isValid) => {
            checkingSession = false;
            if (isValid) {
                // セッションが生きていれば、普通にクリックイベントを起こす
                allowSubmit = true;
                button.click();
            } else {
                // セッションが生きていなければ、警告を出す
                const onClose = () => {
                    root.render(<SessionExpiredAlert open={false} onClose={onClose} />);
                };

                root.render(<SessionExpiredAlert open={true} onClose={onClose} />);

                if (typeof buttonText === "string") {
                    (button as HTMLInputElement).value = buttonText;
                } else {
                    button.innerText = "";
                    button.append(...(buttonText as Element[]));
                }
            }
        });

        return;
    };

    const SessionExpiredAlert: FC<{ open: boolean; onClose: () => void }> = (props) => {
        return (
            <BWMRoot>
                <Dialog {...props}>
                    <DialogContent>
                        <DialogContentText>
                            <ReactMarkdown>{browser.i18n.getMessage("check_session_expired")}</ReactMarkdown>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={props.onClose}>
                            {browser.i18n.getMessage("ok")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </BWMRoot>
        );
    };
})();
