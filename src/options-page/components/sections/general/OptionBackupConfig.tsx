import { exportConfig } from "@/common/config/backup";
import { format } from "date-fns";
import React, { FC, useCallback } from "react";
import { Action } from "../../items/Action";

export const OptionBackupConfig: FC = () => {
    const handleBackupConfig = useCallback(async () => {
        const config = await exportConfig();
        const blob = new Blob([config], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = format(new Date(), "yyyy-MM-dd-HH-mm-ss") + ".json";
        a.click();
    }, []);

    return (
        <Action
            message="options_page_section_general_backup_config"
            description="options_page_section_general_backup_config_description"
            buttonMessage="options_page_section_general_backup_config_button"
            onClick={handleBackupConfig}
        />
    );
};
