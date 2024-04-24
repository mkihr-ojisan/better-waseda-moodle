import { ConfigKey, getStorageUsage, getStorageUsageByKey } from "@/common/config/config";
import { usePromise } from "@/common/react/hooks/usePromise";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import React, { FC } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const StorageUsage: FC = () => {
    const { value: usage } = usePromise(getStorageUsage);

    const percent = usage ? (usage.used / usage.max) * 100 : 0;

    return (
        <>
            <ListItem>
                <ListItemText
                    primary="Storage Usage"
                    disableTypography
                    secondary={
                        <>
                            <Typography variant="body2" color="text.secondary">
                                {usage ? `${usage.used.toLocaleString()} / ${usage.max.toLocaleString()}` : "0 / 0"}{" "}
                                bytes ({percent.toFixed(2)}%)
                            </Typography>
                            <Box pt={1}>
                                <LinearProgress
                                    variant="determinate"
                                    value={percent}
                                    sx={{
                                        ".MuiLinearProgress-bar": {
                                            transition: "none",
                                        },
                                    }}
                                />
                            </Box>
                        </>
                    }
                />
            </ListItem>
            <ListItem disablePadding>
                <ListItemText
                    disableTypography
                    primary={
                        <Accordion
                            disableGutters
                            sx={{ boxShadow: "none" }}
                            slotProps={{ transition: { unmountOnExit: true } }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body2">Usage by Key</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List disablePadding>
                                    {Object.values(ConfigKey)
                                        .filter((key) => typeof key === "number")
                                        .map((key) => (
                                            <StorageUsageByKey key={key} configKey={key as ConfigKey} />
                                        ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    }
                />
            </ListItem>
        </>
    );
};

const StorageUsageByKey = ({ configKey }: { configKey: ConfigKey }) => {
    const { value: usage } = usePromise(() => getStorageUsageByKey(configKey));

    const percent = usage ? (usage.used / usage.max) * 100 : 0;

    return (
        <ListItem disablePadding>
            <ListItemText
                primary={
                    <>
                        <Typography variant="body2" color="text.primary">
                            [{configKey}] {ConfigKey[configKey]}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {usage ? `${usage.used.toLocaleString()} / ${usage.max.toLocaleString()}` : "0 / 0"} bytes (
                            {percent.toFixed(2)}%)
                        </Typography>
                        <Box pt={1}>
                            <LinearProgress
                                variant="determinate"
                                value={percent}
                                sx={{
                                    ".MuiLinearProgress-bar": {
                                        transition: "none",
                                    },
                                }}
                            />
                        </Box>
                    </>
                }
            />
        </ListItem>
    );
};
