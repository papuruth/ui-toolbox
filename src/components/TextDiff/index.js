import { Box, Button, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import { diffWords } from "diff";
import localization from "localization";
import React, { useState } from "react";

const { textDiff: L } = localization;

function getDiffStyle(part) {
    if (part.added) return { background: "rgba(34,204,100,0.25)", color: "success.main", textDecoration: "none" };
    if (part.removed) return { background: "rgba(255,80,80,0.2)", color: "error.main", textDecoration: "line-through" };
    return { background: "transparent", color: "text.primary", textDecoration: "none" };
}

export default function TextDiff() {
    const [original, setOriginal] = useState("");
    const [modified, setModified] = useState("");
    const [diffResult, setDiffResult] = useState(null);

    const computeDiff = () => {
        setDiffResult(diffWords(original, modified));
    };

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledBoxCenter gap={2} flexWrap="wrap" alignItems="flex-start">
                <Box sx={{ flexGrow: 1, minWidth: 240 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        {L.originalLabel}
                    </Typography>
                    <StyledTextField
                        multiline
                        rows={8}
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                        placeholder={L.originalPlaceholder}
                    />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 240 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        {L.modifiedLabel}
                    </Typography>
                    <StyledTextField
                        multiline
                        rows={8}
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                        placeholder={L.modifiedPlaceholder}
                    />
                </Box>
            </StyledBoxCenter>
            <Button variant="contained" onClick={computeDiff} sx={{ alignSelf: "flex-start" }}>
                {L.compareBtn}
            </Button>
            {diffResult && (
                <Box
                    sx={{
                        p: 2,
                        border: "1px solid var(--border-color)",
                        borderRadius: 1,
                        fontFamily: "monospace",
                        fontSize: 14,
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        background: "var(--bg-card)"
                    }}
                >
                    {diffResult.map((part, i) => {
                        const style = getDiffStyle(part);
                        return (
                            <Typography
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                component="span"
                                sx={{
                                    background: style.background,
                                    color: style.color,
                                    textDecoration: style.textDecoration,
                                    fontFamily: "monospace",
                                    fontSize: 14
                                }}
                            >
                                {part.value}
                            </Typography>
                        );
                    })}
                </Box>
            )}
        </StyledBoxContainer>
    );
}
