import { Box, CircularProgress, CircularProgressProps } from "@mui/material";
import React, { FC } from "react";

export const CenteredCircularProgress: FC<CircularProgressProps> = (props) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress {...props} />
        </Box>
    );
};
