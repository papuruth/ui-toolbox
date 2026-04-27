import { Box, Checkbox, Chip, Collapse, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useMemo, useState } from "react";

const { regexTester: L } = localization;

const FLAGS = ["g", "i", "m", "s"];

const PATTERN_LIBRARY = [
    { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}" },
    { label: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*" },
    { label: "IPv4", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b" },
    { label: "Phone (US)", pattern: "\\+?1?[\\s.-]?\\(?[2-9]\\d{2}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}" },
    { label: "Date YYYY-MM-DD", pattern: "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])" },
    { label: "Time HH:MM", pattern: "([01]\\d|2[0-3]):([0-5]\\d)" },
    { label: "Hex Color", pattern: "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b" },
    { label: "UUID", pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" },
    { label: "JWT", pattern: "eyJ[A-Za-z0-9_-]+\\.eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+" },
    { label: "Credit Card", pattern: "\\b(?:4\\d{3}|5[1-5]\\d{2}|6011|3[47]\\d{2})[ -]?\\d{4}[ -]?\\d{4}[ -]?\\d{4}\\b" },
    { label: "ZIP Code (US)", pattern: "\\b\\d{5}(?:-\\d{4})?\\b" },
    { label: "HTML Tag", pattern: "<\\/?[a-zA-Z][^>]*>" },
    { label: "Markdown Link", pattern: "\\[([^\\[]+)\\]\\((.*?)\\)" },
    { label: "Number", pattern: "-?\\b\\d+(?:\\.\\d+)?\\b" }
];

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
    const [testStr, setTestStr] = useState("");
    const [showLibrary, setShowLibrary] = useState(false);

    const { matches, error } = useMemo(() => {
        if (!pattern || !testStr) return { matches: [], error: "" };
        try {
            const activeFlags = FLAGS.filter((f) => flags[f]).join("");
            const globalFlags = activeFlags.includes("g") ? activeFlags : `${activeFlags}g`;
            const found = [...testStr.matchAll(new RegExp(pattern, globalFlags))];
            return { matches: found, error: "" };
        } catch (e) {
            return { matches: [], error: e.message };
        }
    }, [pattern, flags, testStr]);

    const toggleFlag = (f) => setFlags((prev) => ({ ...prev, [f]: !prev[f] }));

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
                <TextField
                    label={L.patternLabel}
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    error={!!error}
                    helperText={error || " "}
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    InputProps={{
                        startAdornment: (
                            <Typography color="text.secondary" sx={{ mr: 0.5 }}>
                                /
                            </Typography>
                        ),
                        endAdornment: (
                            <Typography color="text.secondary" sx={{ ml: 0.5 }}>
                                /
                            </Typography>
                        )
                    }}
                />
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", pt: 1 }}>
                    {FLAGS.map((f) => (
                        <FormControlLabel key={f} control={<Checkbox checked={flags[f]} onChange={() => toggleFlag(f)} size="small" />} label={f} />
                    ))}
                </Box>
            </Box>

            {/* Pattern Library */}
            <Box>
                <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}
                    onClick={() => setShowLibrary((v) => !v)}
                >
                    {showLibrary ? "▾" : "▸"} Pattern Library ({PATTERN_LIBRARY.length} common patterns)
                </Typography>
                <Collapse in={showLibrary}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
                        {PATTERN_LIBRARY.map((p) => (
                            <Chip
                                key={p.label}
                                label={p.label}
                                size="small"
                                variant="outlined"
                                onClick={() => setPattern(p.pattern)}
                                sx={{
                                    cursor: "pointer",
                                    borderColor: "rgba(34,204,153,0.4)",
                                    color: "text.primary",
                                    "&:hover": { background: "rgba(34,204,153,0.1)", borderColor: "#22cc99" }
                                }}
                            />
                        ))}
                    </Box>
                </Collapse>
            </Box>

            <StyledTextField
                multiline
                rows={6}
                label={L.testStringLabel}
                placeholder={L.testStringPlaceholder}
                value={testStr}
                onChange={(e) => setTestStr(e.target.value)}
            />

            <Paper variant="outlined" sx={{ p: 2, background: "var(--bg-card)" }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {matches.length > 0 ? `${matches.length} match${matches.length > 1 ? "es" : ""} found` : pattern ? L.noMatches : L.enterPattern}
                </Typography>
                {matches.map((m, i) => (
                    <Box key={m.index} sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {L.matchAt.replace("[N]", i + 1).replace("[I]", m.index)}{" "}
                        </Typography>
                        <Typography
                            variant="body2"
                            component="span"
                            sx={{ background: "rgba(34,204,153,0.2)", px: 0.5, borderRadius: 0.5, fontFamily: "monospace" }}
                        >
                            {m[0]}
                        </Typography>
                        {m.length > 1 &&
                            m.slice(1).map(
                                (g, gi) =>
                                    g !== undefined && (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <Box key={gi} sx={{ ml: 2, mt: 0.25 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {L.groupLabel.replace("[N]", gi + 1)}{" "}
                                            </Typography>
                                            <Typography variant="body2" component="span" sx={{ fontFamily: "monospace" }}>
                                                {g}
                                            </Typography>
                                        </Box>
                                    )
                            )}
                    </Box>
                ))}
            </Paper>
        </StyledBoxContainer>
    );
}
