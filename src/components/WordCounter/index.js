import { Grid, Paper, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useMemo, useState } from "react";

const { wordCounter: L } = localization;

const STOP_WORDS = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "as",
    "is",
    "it",
    "its",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "shall",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "we",
    "they",
    "my",
    "your",
    "his",
    "her",
    "our",
    "their",
    "not",
    "no",
    "nor",
    "so",
    "yet",
    "both",
    "either",
    "neither",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "than",
    "too",
    "very",
    "just",
    "s",
    "t"
]);

function getStats(text) {
    if (!text) return { words: 0, chars: 0, charsNoSpace: 0, lines: 0, sentences: 0, paragraphs: 0, readingTime: "< 1 min" };
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

function getKeywordDensity(text, topN = 10) {
    if (!text.trim()) return [];
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const freq = {};
    words.forEach((w) => {
        if (!STOP_WORDS.has(w)) freq[w] = (freq[w] || 0) + 1;
    });
    const total = words.filter((w) => !STOP_WORDS.has(w)).length || 1;
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([word, count]) => ({ word, count, pct: ((count / total) * 100).toFixed(1) }));
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
    const keywords = useMemo(() => getKeywordDensity(text), [text]);

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledTextField multiline rows={8} placeholder={L.placeholder} value={text} onChange={(e) => setText(e.target.value)} />
            <Grid container spacing={2}>
                {STAT_LABELS.map(({ key, label }, index) => (
                    <Grid item xs={6} sm={4} md={3} key={key}>
                        <Paper
                            variant="outlined"
                            sx={{ p: 2, textAlign: "center", background: "var(--bg-card)", borderLeft: `3px solid ${STAT_COLORS[index]}` }}
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

            {keywords.length > 0 && (
                <>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                        Keyword Density
                    </Typography>
                    <Grid container spacing={1}>
                        {keywords.map(({ word, count, pct }, i) => (
                            <Grid item xs={6} sm={4} md={3} key={word}>
                                <Paper variant="outlined" sx={{ p: 1.5, background: "var(--bg-card)" }}>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{ fontFamily: "monospace", color: STAT_COLORS[i % STAT_COLORS.length] }}
                                    >
                                        {word}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {count}× · {pct}%
                                    </Typography>
                                    <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: "var(--border-color)", overflow: "hidden" }}>
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${Math.min(100, pct * 5)}%`,
                                                background: STAT_COLORS[i % STAT_COLORS.length],
                                                transition: "width 0.3s"
                                            }}
                                        />
                                    </div>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </StyledBoxContainer>
    );
}
