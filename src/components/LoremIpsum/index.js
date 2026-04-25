import { ContentCopy } from "@mui/icons-material";
import { Box, Button, IconButton, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer } from "components/Shared/Styled-Components";
import StyledNumberInput from "components/Shared/StyledNumberInput";
import localization from "localization";
import React, { useState } from "react";
import toast from "utils/toast";

const { loremIpsum: L, common: C } = localization;

const SOURCE =
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
        " "
    );

function randomWord() {
    return SOURCE[Math.floor(Math.random() * SOURCE.length)];
}

function sentence() {
    const len = 8 + Math.floor(Math.random() * 8);
    const words = Array.from({ length: len }, randomWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return `${words.join(" ")}.`;
}

function paragraph() {
    const numSentences = 3 + Math.floor(Math.random() * 4);
    return Array.from({ length: numSentences }, sentence).join(" ");
}

export default function LoremIpsum() {
    const [count, setCount] = useState(3);
    const [unit, setUnit] = useState("paragraphs");
    const [output, setOutput] = useState("");

    const generate = () => {
        let text = "";
        if (unit === "paragraphs") text = Array.from({ length: count }, paragraph).join("\n\n");
        else if (unit === "sentences") text = Array.from({ length: count }, sentence).join(" ");
        else text = Array.from({ length: count }, randomWord).join(" ");
        setOutput(text);
    };

    const handleCopy = () => {
        if (window?.navigator?.clipboard && output) {
            window.navigator.clipboard.writeText(output);
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
                <Select value={unit} onChange={(e) => setUnit(e.target.value)} size="small" sx={{ minWidth: 140 }}>
                    <MenuItem value="paragraphs">{L.paragraphsOption}</MenuItem>
                    <MenuItem value="sentences">{L.sentencesOption}</MenuItem>
                    <MenuItem value="words">{L.wordsOption}</MenuItem>
                </Select>
                <Button variant="contained" onClick={generate}>
                    {L.generateBtn}
                </Button>
            </StyledBoxCenter>
            {output && (
                <Box>
                    <StyledBoxCenter justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {L.outputLabel}
                        </Typography>
                        <Tooltip title={C.copyToCP}>
                            <IconButton size="small" onClick={handleCopy}>
                                <ContentCopy fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </StyledBoxCenter>
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid var(--border-color)",
                            borderRadius: 1,
                            background: "var(--bg-card)",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.8
                        }}
                    >
                        <Typography variant="body2">{output}</Typography>
                    </Box>
                </Box>
            )}
        </StyledBoxContainer>
    );
}
