import React, { FC, PropsWithChildren } from "react";

export const Center: FC<PropsWithChildren> = (props) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}
        >
            {props.children}
        </div>
    );
};
