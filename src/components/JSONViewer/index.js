import ReactJsonView from "@microlink/react-json-view";
import { Tabs } from "@mui/base/Tabs";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { StyledBoxContainer, StyledButton, StyledTextField } from "components/Shared/Styled-Components";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import React, { useState } from "react";
import api from "services/api";
import toast from "utils/toast";
import Editor from "./components/Editor";

export default function JSONViewer() {
    const [jsonInput, setJSONInput] = useState("");
    const [jsonLink, setJSONLink] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [jsonLoading, setJSONLoading] = useState(false);

    const handleJSONInput = ({ target: { value } }) => {
        setJSONInput(value);
    };

    const handleEditorOperations = async (ctaId) => {
        switch (ctaId) {
            case "paste":
                try {
                    const clipboardText = await window.navigator.clipboard.readText();
                    if (clipboardText?.trim()) {
                        setJSONInput(clipboardText);
                    }
                } catch (error) {
                    console.log("Paste failed");
                }
                break;
            case "copy":
                try {
                    await window.navigator.clipboard.writeText(jsonInput);
                } catch (error) {
                    console.log("Copy failed");
                }
                break;
            case "format":
                try {
                    setJSONInput(JSON.stringify(JSON.parse(jsonInput), null, 4));
                } catch (error) {
                    console.log("Format failed");
                }
                break;
            case "clear":
                setJSONInput("");
                break;
            case "removeWhitespace":
                try {
                    const jsonObject = JSON.parse(jsonInput);
                    if (jsonObject) {
                        setJSONInput(JSON.stringify(jsonObject));
                    }
                } catch (error) {
                    console.log("Whitespace removal failed");
                }
                break;
            case "loadJSONData":
                setShowLinkModal(true);
                break;
            default:
                break;
        }
    };

    const fetchJSONData = async () => {
        try {
            setJSONLoading(true);
            const urlObj = new URL(jsonLink);
            const response = await api.get(urlObj.href);
            if (response.data) {
                setJSONInput(JSON.stringify(response.data));
            }
            setShowLinkModal(false);
        } catch (error) {
            toast.error(error.message);
        }
        setJSONLoading(false);
    };

    return (
        <StyledBoxContainer>
            <Tabs defaultValue={2} style={{ width: "100%" }}>
                <StyledTabsList sx={{ width: 140 }}>
                    <StyledTab value={1} disabled={!jsonInput}>
                        Viewer
                    </StyledTab>
                    <StyledTab value={2}>Editor</StyledTab>
                </StyledTabsList>
                <StyledTabPanel value={1} sx={{ maxHeight: "calc(100vh - 370px)", overflow: "hidden auto" }}>
                    <ReactJsonView src={jsonInput ? JSON.parse(jsonInput) : null} collapsed={1} />
                </StyledTabPanel>
                <StyledTabPanel value={2}>
                    <Editor handleJSONInput={handleJSONInput} jsonInput={jsonInput} handleEditorOperations={handleEditorOperations} />
                </StyledTabPanel>
            </Tabs>
            <Dialog onClose={() => setShowLinkModal(false)} open={showLinkModal} sx={{ width: "100%" }}>
                <DialogTitle>Load JSON Data</DialogTitle>
                <DialogContent sx={{ flexDirection: "column", display: "flex", width: 500, gap: 1, alignItems: "center" }}>
                    <StyledTextField
                        name="jsonLink"
                        placeholder="Enter JSON URL"
                        onChange={(e) => setJSONLink(e.target.value)}
                        size="small"
                        fullWidth
                        autoComplete="off"
                    />
                    <StyledButton
                        sx={{ width: 150 }}
                        variant="outlined"
                        disabled={!jsonLink}
                        loading={jsonLoading}
                        loadingPosition="end"
                        onClick={fetchJSONData}
                    >
                        {jsonLoading ? "Loading" : "Load Data"}
                    </StyledButton>
                </DialogContent>
            </Dialog>
        </StyledBoxContainer>
    );
}
