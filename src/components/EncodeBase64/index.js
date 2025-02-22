import { ContentCopy, Delete, Settings } from "@mui/icons-material";
import { Button, IconButton, Toolbar, Tooltip } from "@mui/material";
import { StyledBoxCenter, StyledTextField } from "components/Shared/Styled-Components";
import React, { useCallback, useState } from "react";
import colors from "styles/colors";
import toast from "utils/toast";
import { StyledText } from "components/DecodeBase64/styles";
import { StyledContainer } from "./styles";

export default function EncodeBase64() {
    const [plainText, setPlainText] = useState("");
    const [copyTooltip, setCopyTooltip] = useState("Copy to clipboard");
    const [encodeStrings, setEncodedStrings] = useState("");

    const handleCopyToClipBoard = useCallback((data) => {
        if (window && window.navigator.clipboard) {
            window.navigator.clipboard.writeText(data).then(() => {
                setCopyTooltip("Copied!");
                setTimeout(() => {
                    setCopyTooltip("Copy to clipboard");
                }, 1000);
            });
        }
    }, []);

    const encodePlainText = useCallback(() => {
        try {
            const base64String = window.btoa(plainText);
            setEncodedStrings(base64String);
        } catch (error) {
            toast.error("The string to be decoded is not correctly encoded.");
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
                                <Tooltip title="Clear">
                                    <IconButton
                                        onClick={() => {
                                            setEncodedStrings("");
                                        }}
                                    >
                                        <Delete color="error" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard(encodeStrings)}>
                                        <ContentCopy color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        ) : null}
                    </StyledBoxCenter>
                    <StyledBoxCenter justifyContent="center">
                        <StyledTextField
                            id="image-base64"
                            placeholder="Base64 String"
                            multiline
                            rows={7}
                            sx={{ width: { xs: "100%", sm: "100%", md: "90%" }, mb: 3 }}
                            value={encodeStrings}
                            disabled
                        />
                    </StyledBoxCenter>
                </StyledBoxCenter>
            </StyledBoxCenter>
            <StyledBoxCenter justifyContent="center">
                <Button endIcon={<Settings />} onClick={encodePlainText} variant="outlined">
                    Encode
                </Button>
            </StyledBoxCenter>
        </StyledContainer>
    );
}
