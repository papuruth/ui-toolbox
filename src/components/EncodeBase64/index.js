import { ContentCopy, Delete } from "@mui/icons-material";
import { Divider, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { StyledBoxCenter, StyledTextField } from "components/Shared/Styled-Components";
import React, { useMemo, useState } from "react";
import colors from "styles/colors";
import { StyledText } from "components/DecodeBase64/styles";
import { StyledContainer } from "./styles";

export default function EncodeBase64() {
    const [plainText, setPlainText] = useState("");
    const [copyTooltip, setCopyTooltip] = useState("Copy to clipboard");

    const handleCopyToClipBoard = (data) => {
        if (window && window.navigator.clipboard) {
            window.navigator.clipboard.writeText(data).then(() => {
                setCopyTooltip("Copied!");
                setTimeout(() => setCopyTooltip("Copy to clipboard"), 1000);
            });
        }
    };

    const { encodeStrings, encodeError } = useMemo(() => {
        if (!plainText) return { encodeStrings: "", encodeError: "" };
        try {
            return { encodeStrings: window.btoa(plainText), encodeError: "" };
        } catch {
            return { encodeStrings: "", encodeError: "String contains characters outside Latin-1 range" };
        }
    }, [plainText]);

    return (
        <StyledContainer>
            <StyledBoxCenter flexDirection={{ xs: "column", sm: "column", md: "row" }}>
                <StyledBoxCenter justifyContent="center" flexDirection="column">
                    <StyledBoxCenter justifyContent="center" width="90%" sx={{ minHeight: 64 }}>
                        <StyledText component="p" color={colors.primary} fontWeight={700} flexGrow={1}>
                            Enter PlainText
                        </StyledText>
                        <StyledText component="p" color={colors.secondary} fontWeight={400}>
                            Size: {plainText ? (plainText.length / 1024).toFixed(2) : 0} KB, {plainText.length} chars
                        </StyledText>
                        {plainText.length > 0 ? (
                            <Toolbar>
                                <Tooltip title="Clear">
                                    <IconButton
                                        onClick={() => {
                                            setPlainText("");
                                        }}
                                    >
                                        <Delete color="error" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard(plainText)}>
                                        <ContentCopy color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        ) : null}
                    </StyledBoxCenter>
                    <StyledBoxCenter justifyContent="center">
                        <StyledTextField
                            id="image-base64"
                            placeholder="Plaintext"
                            multiline
                            rows={7}
                            sx={{ width: { xs: "100%", sm: "100%", md: "90%" }, mb: 3 }}
                            value={plainText}
                            onChange={(event) => {
                                setPlainText(event.target.value);
                            }}
                        />
                    </StyledBoxCenter>
                </StyledBoxCenter>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "none", md: "block" } }} />
                <StyledBoxCenter justifyContent="center" flexDirection="column">
                    <StyledBoxCenter justifyContent="center" width="90%" sx={{ minHeight: 64 }}>
                        <StyledText component="p" color={colors.primary} fontWeight={700} flexGrow={1}>
                            Encode Base64 String
                        </StyledText>
                        <StyledText component="p" color={colors.secondary} fontWeight={400}>
                            Size: {encodeStrings ? (encodeStrings.length / 1024).toFixed(2) : 0} KB, {encodeStrings.length} chars
                        </StyledText>
                        {encodeStrings.length > 0 ? (
                            <Toolbar>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard(encodeStrings)}>
                                        <ContentCopy color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        ) : null}
                    </StyledBoxCenter>
                    {encodeError ? (
                        <Typography variant="caption" color="error" sx={{ mb: 1, pl: "5%" }}>
                            {encodeError}
                        </Typography>
                    ) : null}
                    <StyledBoxCenter justifyContent="center">
                        <StyledTextField
                            id="image-base64"
                            placeholder="Base64 String"
                            multiline
                            rows={7}
                            sx={{ width: { xs: "100%", sm: "100%", md: "90%" }, mb: 3 }}
                            value={encodeStrings}
                            InputProps={{ readOnly: true }}
                        />
                    </StyledBoxCenter>
                </StyledBoxCenter>
            </StyledBoxCenter>
        </StyledContainer>
    );
}
