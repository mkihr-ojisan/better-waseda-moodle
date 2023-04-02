import { importConfig } from "@/common/config/backup";
import { errorToString } from "@/common/error";
import React, { FC, useCallback } from "react";
import { Action } from "../../items/Action";
import { useNotify } from "@/common/react/notification";

export const OptionRestoreConfig: FC = () => {
    const notify = useNotify();

    const handleRestoreConfig = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) {
                return;
            }
            const text = await file.text();
            try {
                await importConfig(text);
            } catch (e) {
                notify({
                    title: browser.i18n.getMessage("options_page_section_general_restore_config_error"),
                    message: errorToString(e),
                    type: "error",
                });
                return;
            }
            notify({
                message: browser.i18n.getMessage("options_page_section_general_restore_config_success"),
                type: "success",
            });
        };
        input.click();
    }, [notify]);

    return (
        <Action
            message="options_page_section_general_restore_config"
            description="options_page_section_general_restore_config_description"
            buttonMessage="options_page_section_general_restore_config_button"
            onClick={handleRestoreConfig}
        />
    );
};
