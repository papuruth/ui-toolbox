import { ContentCopy } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import { camelCase, kebabCase, snakeCase, startCase } from "lodash";
import localization from "localization";
import React, { useState } from "react";
import toast from "utils/toast";

const { textCaseConverter: L, common: C } = localization;

const CASES = [
    { id: "upper", label: "UPPER CASE", fn: (s) => s.toUpperCase() },
    { id: "lower", label: "lower case", fn: (s) => s.toLowerCase() },
    { id: "title", label: "Title Case", fn: (s) => startCase(s.toLowerCase()) },
    { id: "camel", label: "camelCase", fn: (s) => camelCase(s) },
    { id: "pascal", label: "PascalCase", fn: (s) => startCase(camelCase(s)).replace(/\s/g, "") },
    { id: "snake", label: "snake_case", fn: (s) => snakeCase(s) },
    { id: "kebab", label: "kebab-case", fn: (s) => kebabCase(s) }
];

export default function TextCaseConverter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [activeCase, setActiveCase] = useState("");

    const applyCase = (caseObj) => {
        setActiveCase(caseObj.id);
        setOutput(caseObj.fn(input));
    };

    const handleInputChange = (value) => {
        setInput(value);
        if (activeCase) {
            const fn = CASES.find((c) => c.id === activeCase)?.fn;
            if (fn) setOutput(fn(value));
        }
    };

    const handleCopy = () => {
        if (window?.navigator?.clipboard && output) {
            window.navigator.clipboard.writeText(output);
            toast.success("Copied!");
        }
    };

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledTextField multiline rows={5} placeholder={L.inputPlaceholder} value={input} onChange={(e) => handleInputChange(e.target.value)} />
            <Stack direction="row" flexWrap="wrap" gap={1}>
                {CASES.map((c) => (
                    <Chip key={c.id} label={c.label} onClick={() => applyCase(c)} color={activeCase === c.id ? "primary" : "default"} clickable />
                ))}
            </Stack>
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
                    <StyledTextField multiline rows={5} value={output} onChange={() => {}} InputProps={{ readOnly: true }} />
                </Box>
            )}
        </StyledBoxContainer>
    );
}
