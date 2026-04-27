import { Check, ContentCopy } from "@mui/icons-material";
import localization from "localization";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    CodeArea,
    EmptyState,
    ModeBtn,
    ModeToggle,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";

const { loremIpsum: L } = localization;

const SOURCE =
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
        " "
    );

function randomWord() {
    return SOURCE[Math.floor(Math.random() * SOURCE.length)];
}

function sentence() {
    const len = 8 + Math.floor(Math.random() * 8);
    const words = Array.from({ length: len }, randomWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return `${words.join(" ")}.`;
}

function paragraph() {
    const numSentences = 3 + Math.floor(Math.random() * 4);
    return Array.from({ length: numSentences }, sentence).join(" ");
}

const UNITS = ["words", "sentences", "paragraphs"];

const ControlRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
`;

const CountLabel = styled.span`
    font-size: 11px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
`;

const CountInput = styled.input`
    width: 60px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    padding: 4px 8px;
    text-align: center;
    outline: none;
    &:focus {
        border-color: #22cc99;
    }
`;

const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

export default function LoremIpsum() {
    const [count, setCount] = useState(3);
    const [unit, setUnit] = useState("paragraphs");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const generate = useCallback(() => {
        let text = "";
        if (unit === "paragraphs") text = Array.from({ length: count }, paragraph).join("\n\n");
        else if (unit === "sentences") text = Array.from({ length: count }, sentence).join(" ");
        else text = Array.from({ length: count }, randomWord).join(" ");
        setOutput(text);
    }, [count, unit]);

    const handleCopy = useCallback(() => {
        if (!output || !window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(output).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [output]);

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.settingsLabel}</PanelLabel>
                </PanelHeader>
                <ControlRow>
                    <CountLabel>{L.countLabel}</CountLabel>
                    <CountInput
                        type="number"
                        min={1}
                        max={100}
                        value={count}
                        onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    />
                </ControlRow>
                <ModeToggle>
                    {UNITS.map((u) => (
                        <ModeBtn key={u} $active={unit === u} onClick={() => setUnit(u)}>
                            {u.charAt(0).toUpperCase() + u.slice(1)}
                        </ModeBtn>
                    ))}
                </ModeToggle>
                <ActionBar>
                    <BtnGroup>
                        <ActionBtn onClick={generate}>Generate</ActionBtn>
                    </BtnGroup>
                </ActionBar>
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>Output</PanelLabel>
                </PanelHeader>
                {output ? (
                    <>
                        <CodeArea value={output} readOnly spellCheck={false} style={{ flex: 1, minHeight: 320 }} />
                        <ActionBar>
                            <BtnGroup>
                                <ActionBtn $success={copied} onClick={handleCopy}>
                                    {copied ? <Check style={{ fontSize: 11 }} /> : <ContentCopy style={{ fontSize: 11 }} />}
                                    {copied ? "Copied" : "Copy"}
                                </ActionBtn>
                            </BtnGroup>
                        </ActionBar>
                    </>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 22, fontFamily: "JetBrains Mono, monospace" }}>Aa</span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>Click Generate to create lorem ipsum text</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
