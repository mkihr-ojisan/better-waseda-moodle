import { getConfig } from '../../common/config/config';

(async () => {
    if (await getConfig('checkNotesOnSubmitting.enabled')) {
        const checkbox = document.getElementById('id_submissionstatement');
        if (checkbox instanceof HTMLInputElement) {
            checkbox.checked = true;
        }
    }
})();