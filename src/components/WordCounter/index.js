import { Grid, Paper, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useMemo, useState } from "react";

const { wordCounter: L } = localization;

function getStats(text) {
    if (!text) {
        return { words: 0, chars: 0, charsNoSpace: 0, lines: 0, sentences: 0, paragraphs: 0, readingTime: "< 1 min" };
    }
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const lines = text.split("\n").length;
    const sentences = (text.match(/[^.!?]*[.!?]/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const mins = Math.ceil(words / 200);
    const readingTime = mins <= 1 ? "< 1 min" : `~${mins} min`;
    return { words, chars, charsNoSpace, lines, sentences, paragraphs, readingTime };
}

const STAT_COLORS = ["#22cc99", "#2299ff", "#9c27b0", "#ff9800", "#e91e63", "#00bcd4", "#607d8b"];

const STAT_LABELS = [
    { key: "words", label: () => L.wordsLabel },
    { key: "chars", label: () => L.charsLabel },
    { key: "charsNoSpace", label: () => L.charsNoSpaceLabel },
    { key: "lines", label: () => L.linesLabel },
    { key: "sentences", label: () => L.sentencesLabel },
    { key: "paragraphs", label: () => L.paragraphsLabel },
    { key: "readingTime", label: () => L.readingTimeLabel }
];

export default function WordCounter() {
    const [text, setText] = useState("");
    const stats = useMemo(() => getStats(text), [text]);

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledTextField multiline rows={8} placeholder={L.placeholder} value={text} onChange={(e) => setText(e.target.value)} />
            <Grid container spacing={2}>
                {STAT_LABELS.map(({ key, label }, index) => (
                    <Grid item xs={6} sm={4} md={3} key={key}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                textAlign: "center",
                                background: "var(--bg-card)",
                                borderLeft: `3px solid ${STAT_COLORS[index]}`
                            }}
                        >
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                {stats[key]}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {label()}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </StyledBoxContainer>
    );
}
