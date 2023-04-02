import { ConfigKey } from "@/common/config/config";
import { useConfig } from "@/common/config/useConfig";
import React, { FC } from "react";
import { TextBoxOption } from "../../items/TextBoxOption";

export const OptionPassword: FC = () => {
    const [value, setValue] = useConfig(ConfigKey.LoginInfo);

    const setPassword = (password: string) => {
        setValue(value && { ...value, password });
    };

    return (
        <TextBoxOption
            value={value?.password ?? ""}
            setValue={setPassword}
            message="options_page_section_auto_login_password"
            placeholderMessage="options_page_section_auto_login_password_placeholder"
            inputType="password"
        />
    );
};
