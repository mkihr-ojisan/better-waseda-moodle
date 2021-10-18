import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import BWMThemeDarkReader from '../../common/react/theme/BWMThemeDarkReader';
import { MessengerClient } from '../../common/util/messenger';

document.addEventListener(
    'click',
    (event) => {
        let elem = event.target as HTMLElement | null;
        while (elem && elem !== document.body) {
            if (
                elem.classList.contains('mod_quiz-next-nav') ||
                elem.id === 'id_submitbutton' ||
                elem.getAttribute('data-action') === 'forum-inpage-submit'
            ) {
                return onClickSubmitButton(event, elem);
            }

            elem = elem.parentElement;
        }
    },
    true
);

const reactRoot = document.createElement('div');
document.body.appendChild(reactRoot);

let allowSubmit = false;
let checkingSession = false;
let buttonText: string | Element[] = '';
function onClickSubmitButton(event: MouseEvent, button: HTMLElement) {
    if (allowSubmit) return true;
    if (checkingSession) return false;

    const sessionKey = document
        .querySelector('[data-title="logout,moodle"]')
        ?.getAttribute('href')
        ?.match(/sesskey=(.*)$/)?.[1];

    if (!sessionKey) {
        console.warn('cannot find session key...');
        return true;
    }

    event.preventDefault();
    event.stopPropagation();

    checkingSession = true;
    if (button instanceof HTMLInputElement) {
        buttonText = button.value;
        button.value = browser.i18n.getMessage('checkSessionCheckingMessage');
    } else {
        buttonText = Array.from(button.children);
        button.innerText = browser.i18n.getMessage('checkSessionCheckingMessage');
    }
    MessengerClient.exec('checkSessionAlive', sessionKey).then((isSessionAlive) => {
        checkingSession = false;

        if (isSessionAlive) {
            allowSubmit = true;
            button.click();
        } else {
            function onClose() {
                ReactDOM.render(<SessionExpiredAlert open={false} onClose={onClose} />, reactRoot);
            }

            ReactDOM.render(<SessionExpiredAlert open={true} onClose={onClose} />, reactRoot);

            if (typeof buttonText === 'string') {
                (button as HTMLInputElement).value = buttonText;
            } else {
                button.innerText = '';
                button.append(...(buttonText as Element[]));
            }
        }
    });

    return false;
}

function SessionExpiredAlert(props: { open: boolean; onClose: () => void }) {
    return (
        <BWMThemeDarkReader>
            <Dialog {...props}>
                <DialogContent>
                    <DialogContentText>
                        <ReactMarkdown>{browser.i18n.getMessage('checkSessionExpiredMessage')}</ReactMarkdown>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={props.onClose}>
                        {browser.i18n.getMessage('OK')}
                    </Button>
                </DialogActions>
            </Dialog>
        </BWMThemeDarkReader>
    );
}
