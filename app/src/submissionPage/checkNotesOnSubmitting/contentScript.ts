import { getConfig } from '../../common/config/config';
import { CHECK_NOTES_ON_SUBMITTING_ENABLED } from '../../common/config/configKeys';

(async () => {
    if (await getConfig<boolean>(CHECK_NOTES_ON_SUBMITTING_ENABLED)) {
        const checkbox = document.getElementById('id_submissionstatement');
        if (checkbox instanceof HTMLInputElement) {
            checkbox.checked = true;
        }
    }
})();