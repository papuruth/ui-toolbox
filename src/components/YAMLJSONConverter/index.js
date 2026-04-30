import { Check, ContentCopy } from "@mui/icons-material";
import yaml from "js-yaml";
import localization from "localization";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    CodeArea as BaseCodeArea,
    EmptyState,
    MetaText,
    ModeBtn,
    ModeToggle,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";

const { yamlJsonConverter: L, common: C } = localization;

const ToolWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin-top: 4px;
`;

const CodeArea = styled(BaseCodeArea)`
    flex: 1;
    min-height: 320px;
    &:read-only {
        cursor: default;
    }
`;

const ErrorBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 4px;
    padding: 2px 8px;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

export default function YAMLJSONConverter() {
    const [mode, setMode] = useState("yaml2json");
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);

    const handleModeSwitch = useCallback((m) => {
        setMode(m);
        setInput("");
    }, []);

    const { output, error } = useMemo(() => {
        if (!input.trim()) return { output: "", error: "" };
        try {
            if (mode === "yaml2json") {
                return { output: JSON.stringify(yaml.load(input), null, 2), error: "" };
            }
            return { output: yaml.dump(JSON.parse(input)), error: "" };
        } catch (e) {
            return { output: "", error: e.message };
        }
    }, [input, mode]);

    const handleCopy = useCallback(() => {
        if (!output || !window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(output).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [output]);

    const inputLabel = mode === "yaml2json" ? L.yamlInputLabel : L.jsonInputLabel;
    const outputLabel = mode === "yaml2json" ? L.jsonOutputLabel : L.yamlOutputLabel;
    const inputPlaceholder = mode === "yaml2json" ? L.yamlInputPlaceholder : L.jsonInputPlaceholder;
    const outputPlaceholder = mode === "yaml2json" ? "JSON output will appear here…" : "YAML output will appear here…";

    return (
        <ToolWrap>
            <ModeToggle>
                <ModeBtn $active={mode === "yaml2json"} onClick={() => handleModeSwitch("yaml2json")}>
                    {L.yamlToJsonTab}
                </ModeBtn>
                <ModeBtn $active={mode === "json2yaml"} onClick={() => handleModeSwitch("json2yaml")}>
                    {L.jsonToYamlTab}
                </ModeBtn>
            </ModeToggle>

            <ToolLayout style={{ marginTop: 0 }}>
                <Panel>
                    <PanelHeader>
                        <PanelLabel>{inputLabel}</PanelLabel>
                        {input && <MetaText>{input.length.toLocaleString()} chars</MetaText>}
                    </PanelHeader>
                    <CodeArea value={input} onChange={(e) => setInput(e.target.value)} placeholder={inputPlaceholder} spellCheck={false} autoFocus />
                    {input && (
                        <ActionBar>
                            <ActionBtnGroup>
                                <ActionBtn $danger onClick={() => setInput("")}>
                                    {C.clearBtn}
                                </ActionBtn>
                            </ActionBtnGroup>
                        </ActionBar>
                    )}
                </Panel>

                <Panel>
                    <PanelHeader>
                        <PanelLabel>{outputLabel}</PanelLabel>
                        {error ? (
                            <ErrorBadge title={error}>{error}</ErrorBadge>
                        ) : (
                            output && <MetaText>{output.length.toLocaleString()} chars</MetaText>
                        )}
                    </PanelHeader>
                    {output ? (
                        <>
                            <CodeArea value={output} readOnly placeholder={outputPlaceholder} spellCheck={false} />
                            <ActionBar>
                                <BtnGroup>
                                    <ActionBtn $success={copied} onClick={handleCopy}>
                                        {copied ? <Check style={{ fontSize: 11 }} /> : <ContentCopy style={{ fontSize: 11 }} />}
                                        {copied ? L.copiedLabel : L.copyBtn}
                                    </ActionBtn>
                                </BtnGroup>
                            </ActionBar>
                        </>
                    ) : (
                        <EmptyState>
                            <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{error ? L.fixErrorMessage : outputPlaceholder}</span>
                        </EmptyState>
                    )}
                </Panel>
            </ToolLayout>
        </ToolWrap>
    );
}
