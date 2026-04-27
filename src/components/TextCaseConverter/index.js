import { CheckCircle, ContentCopy } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import HistoryDropdown from "components/Shared/HistoryDropdown";
import ShareButton from "components/Shared/ShareButton";
import { camelCase, kebabCase, snakeCase, startCase } from "lodash";
import localization from "localization";
import React, { useEffect, useState } from "react";
import { useToolHistory } from "utils/hooks/useToolHistory.hooks";
import { useShareableURL } from "utils/hooks/useShareableURL.hooks";

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
    const [copied, setCopied] = useState(false);
    const { history: inputHistory, addHistory, clearHistory } = useToolHistory("text-case");
    const { initialValue, shareURL } = useShareableURL("text");

    useEffect(() => {
        if (initialValue) setInput(initialValue);
    }, [initialValue]);

    const applyCase = (caseObj) => {
        setActiveCase(caseObj.id);
        setOutput(caseObj.fn(input));
    };

    const handleInputChange = (value) => {
        setInput(value);
        if (value.trim()) addHistory(value.trim());
        if (activeCase) {
            const fn = CASES.find((c) => c.id === activeCase)?.fn;
            if (fn) setOutput(fn(value));
        }
    };

    const handleCopy = () => {
        if (window?.navigator?.clipboard && output) {
            window.navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                <HistoryDropdown history={inputHistory} onSelect={(v) => handleInputChange(v)} onClear={clearHistory} />
                <ShareButton onShare={() => shareURL(input)} disabled={!input} />
            </Box>
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
                        <Tooltip title={copied ? "Copied!" : C.copyToCP}>
                            <IconButton size="small" onClick={handleCopy}>
                                {copied ? <CheckCircle fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    </StyledBoxCenter>
                    <StyledTextField multiline rows={5} value={output} onChange={() => {}} InputProps={{ readOnly: true }} />
                </Box>
            )}
        </StyledBoxContainer>
    );
}
