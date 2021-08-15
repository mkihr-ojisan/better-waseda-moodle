import { onConfigChange } from '../config/config';
import { assertCurrentContextType } from '../util/util';

assertCurrentContextType('background_script');

export function initToDoList(): void {
    onConfigChange(
        'todo.enabled',
        (_, newValue) => {
            if (newValue) {
                browser.browserAction.enable();
            } else {
                browser.browserAction.disable();
            }
        },
        true
    );
}
