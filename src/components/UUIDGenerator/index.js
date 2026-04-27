import { Check, ContentCopy } from "@mui/icons-material";
import localization from "localization";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    EmptyState,
    ModeBtn,
    ModeToggle,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";

const { uuidGenerator: L } = localization;

function generateV4() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16);
        return (c === "x" ? r : (r % 4) + 8).toString(16);
    });
}

/* eslint-disable no-bitwise */
function generateV1() {
    const now = Date.now();
    const t = now + 122192928000000000; // offset to UUID epoch
    const tLow = (t & 0xffffffff) >>> 0;
    const tMid = ((t / 0x100000000) & 0xffff) >>> 0;
    const tHigh = (((t / 0x1000000000000) & 0x0fff) | 0x1000) >>> 0;
    const clockSeq = (Math.floor(Math.random() * 0x3fff) | 0x8000) >>> 0;
    const node = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0")
    ).join("");
    return [
        tLow.toString(16).padStart(8, "0"),
        tMid.toString(16).padStart(4, "0"),
        tHigh.toString(16).padStart(4, "0"),
        clockSeq.toString(16).padStart(4, "0"),
        node
    ].join("-");
}

function generateV7() {
    // eslint-disable-next-line no-undef
    const ms = BigInt(Date.now());
    // eslint-disable-next-line no-undef
    const rand = Array.from(window.crypto.getRandomValues(new Uint8Array(10)));
    // v7: 48 bits ms | 4 bits ver=7 | 12 bits rand | 2 bits var | 62 bits rand
    const msHex = ms.toString(16).padStart(12, "0");
    const randA = ((rand[0] & 0x0f) | 0x70).toString(16) + rand[1].toString(16).padStart(2, "0").slice(0, 2);
    const randB =
        ((rand[2] & 0x3f) | 0x80).toString(16) +
        rand
            .slice(3, 6)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    const randC = rand
        .slice(6)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return `${msHex.slice(0, 8)}-${msHex.slice(8, 12)}-${randA.slice(0, 4)}-${randB.slice(0, 4)}-${randB.slice(4)}${randC}`.slice(0, 36);
}

const VERSIONS = [
    { value: "v1", label: "v1", fn: generateV1 },
    { value: "v4", label: "v4", fn: generateV4 },
    { value: "v7", label: "v7", fn: generateV7 }
];

const VERSION_DESCRIPTIONS = {
    v1: "Time-based: encodes current timestamp + node address",
    v4: "Random: cryptographically random 128 bits",
    v7: "Unix-time ordered: ms-precision timestamp prefix + random"
};

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

const DescBadge = styled.div`
    padding: 8px 16px;
    font-size: 11px;
    font-family: "Inter", sans-serif;
    color: #22cc99;
    background: rgba(34, 204, 153, 0.08);
    border-bottom: 1px solid var(--border-color);
`;

const UUIDList = styled.div`
    flex: 1;
    overflow: auto;
`;

const UUIDRow = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;
`;

const UUIDText = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    flex: 1;
    letter-spacing: 0.02em;
`;

const RowCopyBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    padding: 2px 4px;
    border-radius: 3px;
    &:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.05);
    }
`;

const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

export default function UUIDGenerator() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState([]);
    const [version, setVersion] = useState("v4");
    const [copiedAll, setCopiedAll] = useState(false);
    const [copiedUuid, setCopiedUuid] = useState(null);

    const generate = useCallback(() => {
        const { fn } = VERSIONS.find((v) => v.value === version) || VERSIONS[1];
        setUuids(Array.from({ length: count }, fn));
    }, [count, version]);

    const copyAll = useCallback(() => {
        if (!uuids.length || !window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(uuids.join("\n")).then(() => {
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 1500);
        });
    }, [uuids]);

    const copyOne = useCallback((uuid) => {
        if (!window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(uuid).then(() => {
            setCopiedUuid(uuid);
            setTimeout(() => setCopiedUuid(null), 1500);
        });
    }, []);

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.settingsLabel}</PanelLabel>
                </PanelHeader>
                <ModeToggle>
                    {VERSIONS.map(({ value, label }) => (
                        <ModeBtn key={value} $active={version === value} onClick={() => setVersion(value)}>
                            {label}
                        </ModeBtn>
                    ))}
                </ModeToggle>
                <DescBadge>{VERSION_DESCRIPTIONS[version]}</DescBadge>
                <ControlRow>
                    <CountLabel>{L.countInputLabel}</CountLabel>
                    <CountInput
                        type="number"
                        min={1}
                        max={100}
                        value={count}
                        onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    />
                </ControlRow>
                <ActionBar>
                    <BtnGroup>
                        <ActionBtn onClick={generate}>{L.generateBtnLabel}</ActionBtn>
                    </BtnGroup>
                </ActionBar>
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.uuidsLabel}</PanelLabel>
                </PanelHeader>
                {uuids.length > 0 ? (
                    <>
                        <UUIDList>
                            {uuids.map((uuid, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <UUIDRow key={i}>
                                    <UUIDText>{uuid}</UUIDText>
                                    <RowCopyBtn onClick={() => copyOne(uuid)} title="Copy">
                                        {copiedUuid === uuid ? <Check style={{ fontSize: 13 }} /> : <ContentCopy style={{ fontSize: 13 }} />}
                                    </RowCopyBtn>
                                </UUIDRow>
                            ))}
                        </UUIDList>
                        <ActionBar>
                            <BtnGroup>
                                <ActionBtn $success={copiedAll} onClick={copyAll}>
                                    {copiedAll ? <Check style={{ fontSize: 11 }} /> : <ContentCopy style={{ fontSize: 11 }} />}
                                    {copiedAll ? L.copiedAll : L.copyAllBtn}
                                </ActionBtn>
                            </BtnGroup>
                        </ActionBar>
                    </>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 15, fontFamily: "JetBrains Mono, monospace", color: "var(--text-secondary)" }}>
                            xxxxxxxx-xxxx-xxxx
                        </span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyStateMessage}</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
