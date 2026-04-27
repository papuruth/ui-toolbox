import ReactJsonView from "@microlink/react-json-view";
import { Tabs } from "@mui/base/Tabs";
import { Box, Button, Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { StyledBoxContainer, StyledButton, StyledTextField } from "components/Shared/Styled-Components";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import HistoryDropdown from "components/Shared/HistoryDropdown";
import React, { useMemo, useState } from "react";
import api from "services/api";
import toast from "utils/toast";
import { useToolHistory } from "utils/hooks/useToolHistory.hooks";
import Editor from "./components/Editor";

function filterJsonByQuery(obj, query) {
    if (!query) return obj;
    const q = query.toLowerCase();
    function walk(val) {
        if (val === null || val === undefined) return val;
        if (typeof val === "string") return val.toLowerCase().includes(q) ? val : undefined;
        if (typeof val === "number" || typeof val === "boolean") return String(val).toLowerCase().includes(q) ? val : undefined;
        if (Array.isArray(val)) {
            const filtered = val.map(walk).filter((v) => v !== undefined);
            return filtered.length ? filtered : undefined;
        }
        if (typeof val === "object") {
            const out = {};
            Object.entries(val).forEach(([k, v]) => {
                if (k.toLowerCase().includes(q)) {
                    out[k] = v;
                    return;
                }
                const child = walk(v);
                if (child !== undefined) out[k] = child;
            });
            return Object.keys(out).length ? out : undefined;
        }
        return undefined;
    }
    const result = walk(obj);
    return result !== undefined ? result : null;
}

export default function JSONViewer() {
    const [jsonInput, setJSONInput] = useState("");
    const [jsonLink, setJSONLink] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [jsonLoading, setJSONLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsed, setCollapsed] = useState(1);
    const { history: jsonHistory, addHistory: addJsonHistory, clearHistory: clearJsonHistory } = useToolHistory("json-viewer");

    const handleJSONInput = ({ target: { value } }) => {
        setJSONInput(value);
        if (value.trim().length > 5) addJsonHistory(value.trim());
    };

    const handleEditorOperations = async (ctaId) => {
        switch (ctaId) {
            case "paste":
                try {
                    const t = await window.navigator.clipboard.readText();
                    if (t?.trim()) setJSONInput(t);
                } catch {
                    /* ignore */
                }
                break;
            case "copy":
                try {
                    await window.navigator.clipboard.writeText(jsonInput);
                } catch {
                    /* ignore */
                }
                break;
            case "format":
                try {
                    setJSONInput(JSON.stringify(JSON.parse(jsonInput), null, 4));
                } catch {
                    /* ignore */
                }
                break;
            case "clear":
                setJSONInput("");
                setSearchQuery("");
                break;
            case "removeWhitespace":
                try {
                    const o = JSON.parse(jsonInput);
                    if (o) setJSONInput(JSON.stringify(o));
                } catch {
                    /* ignore */
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
            if (response.data) setJSONInput(JSON.stringify(response.data));
            setShowLinkModal(false);
        } catch (error) {
            toast.error(error.message);
        }
        setJSONLoading(false);
    };

    const parsedJson = useMemo(() => {
        if (!jsonInput) return null;
        try {
            return JSON.parse(jsonInput);
        } catch {
            return null;
        }
    }, [jsonInput]);

    const filteredJson = useMemo(() => filterJsonByQuery(parsedJson, searchQuery), [parsedJson, searchQuery]);

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
                    <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                        <TextField
                            size="small"
                            placeholder="Search keys / values..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ flexGrow: 1, maxWidth: 320 }}
                            InputProps={{ startAdornment: <InputAdornment position="start">🔍</InputAdornment> }}
                        />
                        <Button size="small" variant="outlined" onClick={() => setCollapsed(false)}>
                            Expand All
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => setCollapsed(1)}>
                            Collapse All
                        </Button>
                    </Box>
                    {filteredJson !== null && filteredJson !== undefined ? (
                        <ReactJsonView key={`${collapsed}-${searchQuery}`} src={filteredJson} collapsed={collapsed} theme="monokai" />
                    ) : (
                        <Box sx={{ p: 2, color: "text.secondary", fontFamily: "monospace", fontSize: "0.85rem" }}>
                            {searchQuery ? "No matches found" : "No valid JSON to display"}
                        </Box>
                    )}
                </StyledTabPanel>
                <StyledTabPanel value={2}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
                        <HistoryDropdown history={jsonHistory} onSelect={(v) => setJSONInput(v)} onClear={clearJsonHistory} />
                    </Box>
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
