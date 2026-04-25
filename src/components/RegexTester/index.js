import { Box, Checkbox, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useMemo, useState } from "react";

const { regexTester: L } = localization;

const FLAGS = ["g", "i", "m", "s"];

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
    const [testStr, setTestStr] = useState("");

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
                            sx={{
                                background: "rgba(34,204,153,0.2)",
                                px: 0.5,
                                borderRadius: 0.5,
                                fontFamily: "monospace"
                            }}
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
