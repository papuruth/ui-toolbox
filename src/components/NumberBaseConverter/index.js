import { Box, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useMemo, useState } from "react";

const { numberBaseConverter: L } = localization;

const BASES = [
    { value: 2, label: "Binary (Base 2)" },
    { value: 8, label: "Octal (Base 8)" },
    { value: 10, label: "Decimal (Base 10)" },
    { value: 16, label: "Hexadecimal (Base 16)" }
];

const OUTPUTS = [
    { base: 2, label: "Binary", prefix: "0b" },
    { base: 8, label: "Octal", prefix: "0o" },
    { base: 10, label: "Decimal", prefix: "" },
    { base: 16, label: "Hexadecimal", prefix: "0x" }
];

export default function NumberBaseConverter() {
    const [input, setInput] = useState("");
    const [sourceBase, setSourceBase] = useState(10);

    const { results, error } = useMemo(() => {
        if (!input.trim()) return { results: null, error: "" };
        const decimal = parseInt(input.trim(), sourceBase);
        if (Number.isNaN(decimal)) return { results: null, error: L.invalidInputError.replace("[INPUT]", input).replace("[BASE]", sourceBase) };
        return {
            results: OUTPUTS.map(({ base, label, prefix }) => ({
                label,
                value: prefix + decimal.toString(base).toUpperCase()
            })),
            error: ""
        };
    }, [input, sourceBase]);

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledBoxCenter gap={2} flexWrap="wrap" alignItems="flex-start">
                <TextField
                    label={L.inputLabel}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    error={!!error}
                    helperText={error || " "}
                    sx={{ flexGrow: 1, minWidth: 160 }}
                />
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        {L.sourceBaseLabel}
                    </Typography>
                    <Select
                        value={sourceBase}
                        onChange={(e) => setSourceBase(Number(e.target.value))}
                        size="small"
                        fullWidth
                        sx={{ mt: 0.5, minWidth: 200 }}
                    >
                        {BASES.map(({ value, label }) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </StyledBoxCenter>
            {results &&
                results.map(({ label, value }) => (
                    <Paper key={label} variant="outlined" sx={{ p: 2, background: "var(--bg-card)" }}>
                        <Typography variant="caption" color="text.secondary">
                            {label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: "monospace", mt: 0.5 }}>
                            {value}
                        </Typography>
                    </Paper>
                ))}
        </StyledBoxContainer>
    );
}
