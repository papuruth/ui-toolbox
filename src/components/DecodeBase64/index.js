import { ContentCopy, Delete, Settings } from "@mui/icons-material";
import { Button, IconButton, Toolbar, Tooltip } from "@mui/material";
import { StyledBoxCenter, StyledTextField } from "components/Shared/Styled-Components";
import React, { useCallback, useState } from "react";
import colors from "styles/colors";
import toast from "utils/toast";
import { StyledContainer, StyledText } from "./styles";

export default function DecodeBase64() {
    const [base64Data, setBase64Data] = useState("");
    const [copyTooltip, setCopyTooltip] = useState("Copy to clipboard");
    const [decodedStrings, setDecodedStrings] = useState("");

    const handleCopyToClipBoard = useCallback(() => {
        if (window && window.navigator.clipboard) {
            window.navigator.clipboard.writeText(base64Data).then(() => {
                setCopyTooltip("Copied!");
                setTimeout(() => {
                    setCopyTooltip("Copy to clipboard");
                }, 1000);
            });
        }
    }, [base64Data]);

    const decodeStrings = useCallback(() => {
        try {
            const plainText = window.atob(base64Data);
            setDecodedStrings(plainText);
        } catch (error) {
            toast.error("The string to be encoded is invalid.");
        }
    }, [base64Data]);

    return (
        <StyledContainer>
            <StyledBoxCenter flexDirection={{ xs: "column", sm: "column", md: "row" }}>
                <StyledBoxCenter justifyContent="center" flexDirection="column">
                    <StyledBoxCenter justifyContent="center" width="90%" sx={{ minHeight: 64 }}>
                        <StyledText component="p" color={colors.primary} fontWeight={700} flexGrow={1}>
                            Enter Base64 String
                        </StyledText>
                        <StyledText component="p" color={colors.secondary} fontWeight={400}>
                            Size: {base64Data ? (base64Data.length / 1024).toFixed(2) : 0} KB, {base64Data.length} chars
                        </StyledText>
                        {base64Data.length > 0 ? (
                            <Toolbar>
                                <Tooltip title="Clear">
                                    <IconButton
                                        onClick={() => {
                                            setBase64Data("");
                                        }}
                                    >
                                        <Delete color="error" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard(base64Data)}>
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
                            value={base64Data}
                            onChange={(event) => {
                                setBase64Data(event.target.value);
                            }}
                        />
                    </StyledBoxCenter>
                </StyledBoxCenter>
                <StyledBoxCenter justifyContent="center" flexDirection="column">
                    <StyledBoxCenter justifyContent="center" width="90%" sx={{ minHeight: 64 }}>
                        <StyledText component="p" color={colors.primary} fontWeight={700} flexGrow={1}>
                            Decoded String
                        </StyledText>
                        <StyledText component="p" color={colors.secondary} fontWeight={400}>
                            Size: {decodedStrings ? (decodedStrings.length / 1024).toFixed(2) : 0} KB, {decodedStrings.length} chars
                        </StyledText>
                        {decodedStrings.length > 0 ? (
                            <Toolbar>
                                <Tooltip title="Clear">
                                    <IconButton
                                        onClick={() => {
                                            setDecodedStrings("");
                                        }}
                                    >
                                        <Delete color="error" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard(decodedStrings)}>
                                        <ContentCopy color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        ) : null}
                    </StyledBoxCenter>
                    <StyledBoxCenter justifyContent="center">
                        <StyledTextField
                            id="image-base64"
                            placeholder="Decoded String"
                            multiline
                            rows={7}
                            sx={{ width: { xs: "100%", sm: "100%", md: "90%" }, mb: 3 }}
                            value={decodedStrings}
                            disabled
                        />
                    </StyledBoxCenter>
                </StyledBoxCenter>
            </StyledBoxCenter>
            <StyledBoxCenter justifyContent="center">
                <Button endIcon={<Settings />} onClick={decodeStrings} variant="outlined">
                    Decode
                </Button>
            </StyledBoxCenter>
        </StyledContainer>
    );
}
