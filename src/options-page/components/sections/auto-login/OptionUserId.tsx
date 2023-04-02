import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import React, { FC } from "react";
import { TextBoxOption } from "../../items/TextBoxOption";

export const OptionUserId: FC = () => {
    const [value, setValue] = useConfig(ConfigKey.LoginInfo);

    const setUserId = (userId: string) => {
        setValue(value && { ...value, userId });
    };

    return (
        <TextBoxOption
            value={value?.userId ?? ""}
            setValue={setUserId}
            message="options_page_section_auto_login_user_id"
            placeholderMessage="options_page_section_auto_login_user_id_placeholder"
        />
    );
};
