import ReactJsonView from "@microlink/react-json-view";
import HistoryDropdown from "components/Shared/HistoryDropdown";
import localization from "localization";
import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ActionBtn, ActionBtnGroup, Panel, PanelHeader, PanelLabel, TabBtn, TabStrip } from "components/Shared/ToolKit";
import { useToolHistory } from "utils/hooks/useToolHistory.hooks";
import { useToolChain } from "context/ToolChainContext";
import ColorModeContext from "../../context/ColorModeContext";
import LoadJSONModal from "./components/LoadJSONModal";

import Editor from "./components/Editor";

const { jsonViewer: L } = localization;

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

const ToolWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    flex: 1;
`;

const ViewerControls = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
`;

const SearchInput = styled.input`
    flex: 1;
    min-width: 160px;
    max-width: 280px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    font-size: 12px;
    padding: 5px 10px;
    outline: none;
    &:focus {
        border-color: #22cc99;
    }
    &::placeholder {
        color: var(--text-secondary);
    }
`;

const ViewerArea = styled.div`
    flex: 1;
    overflow: auto;
    padding: 16px;
    background: var(--bg-input);
    min-height: 320px;
`;

const NoMatch = styled.div`
    color: var(--text-secondary);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    opacity: 0.6;
`;


const ViewerBtnGroup = styled(ActionBtnGroup)`
    flex-shrink: 0;
`;

export default function JSONViewer() {
    const { mode } = useContext(ColorModeContext);
    const [tab, setTab] = useState("editor");
    const [jsonInput, setJSONInput] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsed, setCollapsed] = useState(1);
    const { history: jsonHistory, addHistory: addJsonHistory, clearHistory: clearJsonHistory } = useToolHistory("json-viewer");
    const { consumeChain } = useToolChain();

    useEffect(() => {
        const chained = consumeChain("/json-viewer");
        if (chained) setJSONInput(chained);
    }, [consumeChain]);

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

    const handleModalLoad = (jsonString) => {
        setJSONInput(jsonString);
        if (jsonString.trim().length > 5) addJsonHistory(jsonString.trim());
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

    const handleJsonMutation = ({ updated_src }) => {
        const formatted = JSON.stringify(updated_src, null, 4);
        setJSONInput(formatted);
        addJsonHistory(formatted);
    };

    return (
        <ToolWrap>
            <TabStrip>
                <TabBtn $active={tab === "editor"} onClick={() => setTab("editor")}>
                    {L.editorTab}
                </TabBtn>
                <TabBtn $active={tab === "viewer"} onClick={() => setTab("viewer")} disabled={!jsonInput}>
                    {L.viewerTab}
                </TabBtn>
            </TabStrip>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{tab === "editor" ? L.jsonInputLabel : L.jsonViewerLabel}</PanelLabel>
                    {tab === "editor" && <HistoryDropdown history={jsonHistory} onSelect={(v) => setJSONInput(v)} onClear={clearJsonHistory} />}
                </PanelHeader>

                {tab === "editor" ? (
                    <Editor handleJSONInput={handleJSONInput} jsonInput={jsonInput} handleEditorOperations={handleEditorOperations} />
                ) : (
                    <>
                        <ViewerControls>
                            <SearchInput
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={L.searchPlaceholder}
                                spellCheck={false}
                            />
                            <ViewerBtnGroup>
                                <ActionBtn onClick={() => setCollapsed(false)}>{L.expandAllBtn}</ActionBtn>
                                <ActionBtn onClick={() => setCollapsed(true)}>{L.collapseAllBtn}</ActionBtn>
                            </ViewerBtnGroup>
                        </ViewerControls>
                        <ViewerArea>
                            {filteredJson !== null && filteredJson !== undefined ? (
                                <ReactJsonView
                                    key={collapsed}
                                    src={filteredJson}
                                    collapsed={collapsed}
                                    theme={mode === "dark" ? "ocean" : "rjv-default"}
                                    iconStyle="circle"
                                    displayDataTypes={false}
                                    quotesOnKeys={false}
                                    showComma
                                    onAdd={searchQuery ? undefined : handleJsonMutation}
                                    onEdit={searchQuery ? undefined : handleJsonMutation}
                                    onDelete={searchQuery ? undefined : handleJsonMutation}
                                />
                            ) : (
                                <NoMatch>{searchQuery ? L.noMatchesMessage : L.noValidJsonMessage}</NoMatch>
                            )}
                        </ViewerArea>
                    </>
                )}
            </Panel>

            <LoadJSONModal
                open={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onLoad={handleModalLoad}
            />
        </ToolWrap>
    );
}
