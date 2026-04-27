import { Check, ContentCopy } from "@mui/icons-material";
import localization from "localization";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { EmptyState, ModeBtn, ModeToggle, Panel, PanelHeader, PanelLabel, ToolLayout } from "components/Shared/ToolKit";

const { timestampConverter: L } = localization;

const SYSTEM_TZ = (() => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return "UTC";
    }
})();

const COMMON_TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Sao_Paulo",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Moscow",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Asia/Singapore",
    "Australia/Sydney",
    "Pacific/Auckland"
];

const ALL_TIMEZONES = (() => {
    try {
        const intl = Intl.supportedValuesOf("timeZone");
        return [...new Set([...COMMON_TIMEZONES, ...intl])].sort();
    } catch {
        return COMMON_TIMEZONES;
    }
})();

function formatInTz(unixSec, tz) {
    try {
        const date = new Date(unixSec * 1000);
        return new Intl.DateTimeFormat("en-CA", {
            timeZone: tz,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        })
            .format(date)
            .replace(",", "");
    } catch {
        return "—";
    }
}

const ToolWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin-top: 4px;
`;

const InputWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input`
    width: 100%;
    background: var(--bg-input);
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 13px;
    padding: 14px 40px 14px 16px;
    box-sizing: border-box;
    &::placeholder {
        color: var(--text-secondary);
    }
`;

const ClearBtn = styled.button`
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 14px;
    line-height: 1;
    padding: 0;
    &:hover {
        color: var(--text-primary);
        background: rgba(128, 128, 128, 0.15);
    }
`;

const DatePickerRow = styled.div`
    padding: 10px 16px;
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 10px;
`;

const DatePickerInput = styled.input`
    flex: 1;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    font-size: 11px;
    padding: 4px 8px;
    outline: none;
    cursor: pointer;
    color-scheme: light dark;
    &:focus {
        border-color: #22cc99;
    }
`;

const TzRow = styled.div`
    padding: 10px 16px;
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 10px;
`;

const TzLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    white-space: nowrap;
`;

const TzSelect = styled.select`
    flex: 1;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    font-size: 11px;
    padding: 4px 8px;
    outline: none;
    cursor: pointer;
    &:focus {
        border-color: #22cc99;
    }
`;

const ResultRows = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ResultRow = styled.div`
    display: flex;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;
`;

const ResultLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    min-width: 120px;
`;

const ResultValue = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    flex: 1;
    word-break: break-all;
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

const ErrorBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 4px;
    padding: 2px 8px;
`;

export default function TimestampConverter() {
    const [mode, setMode] = useState("unix2date");
    const [unixInput, setUnixInput] = useState("");
    const [dateInput, setDateInput] = useState("");
    const [tz, setTz] = useState(SYSTEM_TZ);
    const [copiedLabel, setCopiedLabel] = useState(null);

    const unix2dateResult = useMemo(() => {
        if (!unixInput.trim()) return { rows: null, error: "" };
        const ts = parseInt(unixInput.trim(), 10);
        if (Number.isNaN(ts)) return { rows: null, error: L.invalidUnixTimestampError };
        const m = moment.unix(ts);
        if (!m.isValid()) return { rows: null, error: L.invalidTimestampError };
        return {
            rows: [
                { label: `Timezone (${tz})`, value: formatInTz(ts, tz) },
                { label: "UTC", value: formatInTz(ts, "UTC") },
                { label: "ISO 8601", value: new Date(ts * 1000).toISOString() },
                { label: "Relative", value: moment.unix(ts).fromNow() }
            ],
            error: ""
        };
    }, [unixInput, tz]);

    const date2unixResult = useMemo(() => {
        if (!dateInput.trim()) return { rows: null, error: "" };
        const m = moment(dateInput.trim());
        if (!m.isValid()) return { rows: null, error: L.invalidDateError };
        return {
            rows: [
                { label: "Unix (seconds)", value: String(m.unix()) },
                { label: "Unix (ms)", value: String(m.valueOf()) }
            ],
            error: ""
        };
    }, [dateInput]);

    const handleCopy = useCallback((label, value) => {
        if (!window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(value).then(() => {
            setCopiedLabel(label);
            setTimeout(() => setCopiedLabel(null), 1500);
        });
    }, []);

    const { rows: activeRows, error: activeError } = mode === "unix2date" ? unix2dateResult : date2unixResult;

    return (
        <ToolWrap>
            <ModeToggle>
                <ModeBtn $active={mode === "unix2date"} onClick={() => setMode("unix2date")}>
                    {L.unixToDateMode}
                </ModeBtn>
                <ModeBtn $active={mode === "date2unix"} onClick={() => setMode("date2unix")}>
                    {L.dateToUnixMode}
                </ModeBtn>
            </ModeToggle>

            <ToolLayout style={{ marginTop: 0 }}>
                <Panel>
                    <PanelHeader>
                        <PanelLabel>{mode === "unix2date" ? L.unixTimestampLabel : L.dateStringLabel}</PanelLabel>
                        {activeError && <ErrorBadge>{activeError}</ErrorBadge>}
                    </PanelHeader>
                    <InputWrap>
                        <StyledInput
                            value={mode === "unix2date" ? unixInput : dateInput}
                            onChange={(e) => (mode === "unix2date" ? setUnixInput(e.target.value) : setDateInput(e.target.value))}
                            placeholder={mode === "unix2date" ? "e.g. 1716825600" : "e.g. 2024-05-27 12:00:00"}
                            spellCheck={false}
                            autoFocus
                        />
                        {(mode === "unix2date" ? unixInput : dateInput) && (
                            <ClearBtn onClick={() => (mode === "unix2date" ? setUnixInput("") : setDateInput(""))} title="Clear">
                                ×
                            </ClearBtn>
                        )}
                    </InputWrap>
                    {mode === "date2unix" && (
                        <DatePickerRow>
                            <TzLabel>{L.pickDateLabel}</TzLabel>
                            <DatePickerInput
                                type="datetime-local"
                                onChange={(e) => {
                                    if (e.target.value) setDateInput(e.target.value.replace("T", " "));
                                }}
                            />
                        </DatePickerRow>
                    )}
                    {mode === "unix2date" && (
                        <TzRow>
                            <TzLabel>{L.timezoneLabel}</TzLabel>
                            <TzSelect value={tz} onChange={(e) => setTz(e.target.value)}>
                                {ALL_TIMEZONES.map((zone) => (
                                    <option key={zone} value={zone}>
                                        {zone}
                                    </option>
                                ))}
                            </TzSelect>
                        </TzRow>
                    )}
                </Panel>

                <Panel>
                    <PanelHeader>
                        <PanelLabel>{L.resultLabel}</PanelLabel>
                    </PanelHeader>
                    {activeRows ? (
                        <ResultRows>
                            {activeRows.map(({ label, value }) => (
                                <ResultRow key={label}>
                                    <ResultLabel>{label}</ResultLabel>
                                    <ResultValue>{value}</ResultValue>
                                    <RowCopyBtn onClick={() => handleCopy(label, value)} title="Copy">
                                        {copiedLabel === label ? <Check style={{ fontSize: 13 }} /> : <ContentCopy style={{ fontSize: 13 }} />}
                                    </RowCopyBtn>
                                </ResultRow>
                            ))}
                        </ResultRows>
                    ) : (
                        <EmptyState>
                            <span style={{ fontSize: 22, fontFamily: "JetBrains Mono, monospace" }}>t</span>
                            <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                                {mode === "unix2date" ? L.unixEmptyMessage : L.dateEmptyMessage}
                            </span>
                        </EmptyState>
                    )}
                </Panel>
            </ToolLayout>
        </ToolWrap>
    );
}
