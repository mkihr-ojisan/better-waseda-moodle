import { getConfig } from '../../config/config';
import { CHECK_NOTES_ON_SUBMITTING_ENABLED } from '../../config/configKeys';

(async () => {
    if (await getConfig<boolean>(CHECK_NOTES_ON_SUBMITTING_ENABLED)) {
        const checkbox = document.getElementById('id_submissionstatement');
        if (checkbox instanceof HTMLInputElement) {
            checkbox.checked = true;
        }
    }
})();