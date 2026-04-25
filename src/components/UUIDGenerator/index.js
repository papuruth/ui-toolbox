import { ContentCopy } from "@mui/icons-material";
import { Box, Button, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer } from "components/Shared/Styled-Components";
import StyledNumberInput from "components/Shared/StyledNumberInput";
import localization from "localization";
import React, { useState } from "react";
import toast from "utils/toast";

const { uuidGenerator: L, common: C } = localization;

function generateUUID() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16);
        return (c === "x" ? r : (r % 4) + 8).toString(16);
    });
}

export default function UUIDGenerator() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState([]);

    const generate = () => {
        setUuids(Array.from({ length: count }, generateUUID));
    };

    const copyAll = () => {
        if (window?.navigator?.clipboard && uuids.length) {
            window.navigator.clipboard.writeText(uuids.join("\n"));
            toast.success(L.copiedAll);
        }
    };

    const copyOne = (uuid) => {
        if (window?.navigator?.clipboard) {
            window.navigator.clipboard.writeText(uuid);
            toast.success("Copied!");
        }
    };

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledBoxCenter gap={2} flexWrap="wrap">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {L.countLabel}
                    </Typography>
                    <StyledNumberInput min={1} max={100} value={count} onChange={(_, val) => setCount(val ?? 1)} />
                </Box>
                <Button variant="contained" onClick={generate}>
                    {L.generateBtn}
                </Button>
                {uuids.length > 0 && (
                    <Button variant="outlined" onClick={copyAll} startIcon={<ContentCopy />}>
                        {L.copyAllBtn}
                    </Button>
                )}
            </StyledBoxCenter>
            {uuids.length > 0 && (
                <List dense disablePadding>
                    {uuids.map((uuid) => (
                        <ListItem
                            key={uuid}
                            secondaryAction={
                                <Tooltip title={C.copyToCP}>
                                    <IconButton edge="end" size="small" onClick={() => copyOne(uuid)}>
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            }
                            sx={{ borderBottom: "1px solid var(--border-color)" }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                                        {uuid}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </StyledBoxContainer>
    );
}
