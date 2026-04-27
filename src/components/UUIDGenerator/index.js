import { ContentCopy } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, List, ListItem, ListItemText, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer } from "components/Shared/Styled-Components";
import StyledNumberInput from "components/Shared/StyledNumberInput";
import localization from "localization";
import React, { useState } from "react";
import toast from "utils/toast";

const { uuidGenerator: L, common: C } = localization;

function generateV4() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16);
        return (c === "x" ? r : (r % 4) + 8).toString(16);
    });
}

/* eslint-disable no-bitwise */
function generateV1() {
    const now = Date.now();
    const t = now + 122192928000000000; // offset to UUID epoch
    const tLow = (t & 0xffffffff) >>> 0;
    const tMid = ((t / 0x100000000) & 0xffff) >>> 0;
    const tHigh = (((t / 0x1000000000000) & 0x0fff) | 0x1000) >>> 0;
    const clockSeq = (Math.floor(Math.random() * 0x3fff) | 0x8000) >>> 0;
    const node = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0")
    ).join("");
    return [
        tLow.toString(16).padStart(8, "0"),
        tMid.toString(16).padStart(4, "0"),
        tHigh.toString(16).padStart(4, "0"),
        clockSeq.toString(16).padStart(4, "0"),
        node
    ].join("-");
}

function generateV7() {
    // eslint-disable-next-line no-undef
    const ms = BigInt(Date.now());
    // eslint-disable-next-line no-undef
    const rand = Array.from(window.crypto.getRandomValues(new Uint8Array(10)));
    // v7: 48 bits ms | 4 bits ver=7 | 12 bits rand | 2 bits var | 62 bits rand
    const msHex = ms.toString(16).padStart(12, "0");
    const randA = ((rand[0] & 0x0f) | 0x70).toString(16) + rand[1].toString(16).padStart(2, "0").slice(0, 2);
    const randB =
        ((rand[2] & 0x3f) | 0x80).toString(16) +
        rand
            .slice(3, 6)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    const randC = rand
        .slice(6)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return `${msHex.slice(0, 8)}-${msHex.slice(8, 12)}-${randA.slice(0, 4)}-${randB.slice(0, 4)}-${randB.slice(4)}${randC}`.slice(0, 36);
}

const VERSIONS = [
    { value: "v1", label: "v1 (Time-based)", fn: generateV1 },
    { value: "v4", label: "v4 (Random)", fn: generateV4 },
    { value: "v7", label: "v7 (Unix-time ordered)", fn: generateV7 }
];

const VERSION_DESCRIPTIONS = {
    v1: "Time-based: encodes current timestamp + node address",
    v4: "Random: cryptographically random 128 bits",
    v7: "Unix-time ordered: ms-precision timestamp prefix + random"
};

export default function UUIDGenerator() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState([]);
    const [version, setVersion] = useState("v4");

    const generate = () => {
        const fn = VERSIONS.find((v) => v.value === version)?.fn || generateV4;
        setUuids(Array.from({ length: count }, fn));
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
            <StyledBoxCenter gap={2} flexWrap="wrap" alignItems="center">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Version:
                    </Typography>
                    <Select value={version} onChange={(e) => setVersion(e.target.value)} size="small" sx={{ minWidth: 200 }}>
                        {VERSIONS.map((v) => (
                            <MenuItem key={v.value} value={v.value}>
                                {v.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
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

            <Chip
                label={VERSION_DESCRIPTIONS[version]}
                size="small"
                sx={{ alignSelf: "flex-start", background: "rgba(34,204,153,0.1)", color: "#22cc99" }}
            />

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
