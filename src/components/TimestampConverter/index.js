import { CalendarToday, Check, ContentCopy, ExpandMore, Schedule } from "@mui/icons-material";
import { format } from "date-fns";
import localization from "localization";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/src/style.css";
import styled from "styled-components";
import { EmptyState, ModeBtn, ModeToggle, Panel, PanelHeader, PanelLabel, ToolLayout } from "components/Shared/ToolKit";

const { timestampConverter: L } = localization;

const SYSTEM_TZ = (() => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Calcutta"
            ? "Asia/Kolkata"
            : Intl.DateTimeFormat().resolvedOptions().timeZone;
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

const DEPRECATED_TZ = new Set([
    "Asia/Calcutta",
    "Asia/Katmandu",
    "Asia/Dacca",
    "Asia/Ashkhabad",
    "Asia/Chungking",
    "Asia/Harbin",
    "Asia/Istanbul",
    "Asia/Kashgar",
    "Asia/Macao",
    "Asia/Saigon",
    "Asia/Thimbu",
    "Asia/Ujung_Pandang",
    "Asia/Ulaanbaatar",
    "Europe/Kiev",
    "Europe/Uzhgorod",
    "Europe/Zaporozhye",
    "Europe/Belfast",
    "Europe/Tiraspol",
    "Europe/Nicosia",
    "America/Buenos_Aires",
    "America/Cordoba",
    "America/Jujuy",
    "America/Mendoza",
    "America/Catamarca",
    "America/Rosario",
    "America/Godthab",
    "America/Montreal",
    "America/Shiprock",
    "America/Virgin",
    "America/Atka",
    "America/Ensenada",
    "America/Knox_IN",
    "America/Louisville",
    "America/Porto_Acre",
    "America/Santa_Isabel",
    "Pacific/Samoa",
    "Pacific/Johnston",
    "Pacific/Truk",
    "Pacific/Pohnpei",
    "Pacific/Ponape",
    "Pacific/Chuuk",
    "Pacific/Yap",
    "Australia/ACT",
    "Australia/LHI",
    "Australia/Canberra",
    "Australia/NSW",
    "Australia/North",
    "Australia/Queensland",
    "Australia/South",
    "Australia/Tasmania",
    "Australia/Victoria",
    "Australia/West",
    "Australia/Yancowinna",
    "Atlantic/Faeroe",
    "Atlantic/Jan_Mayen",
    "Africa/Asmera",
    "Africa/Timbuktu",
    "Antarctica/South_Pole"
]);

const IANA_CONTINENT = /^(Africa|America|Antarctica|Arctic|Asia|Atlantic|Australia|Europe|Indian|Pacific)\//;

const ALL_TIMEZONES = (() => {
    try {
        const intl = Intl.supportedValuesOf("timeZone").filter((tz) => (IANA_CONTINENT.test(tz) || tz === "UTC") && !DEPRECATED_TZ.has(tz));
        return [...new Set([...COMMON_TIMEZONES, ...intl])].sort();
    } catch {
        return COMMON_TIMEZONES;
    }
})();

function getUtcOffset(tz) {
    try {
        const parts = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(new Date());
        return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    } catch {
        return "";
    }
}

const TZ_OFFSETS = Object.fromEntries(ALL_TIMEZONES.map((tz) => [tz, getUtcOffset(tz)]));

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
    border-left: 2px solid transparent;
    outline: none;
    color: var(--text-primary);
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 14px;
    padding: 16px 40px 16px 16px;
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    &:focus {
        border-left-color: #22cc99;
        box-shadow: inset 4px 0 16px rgba(34, 204, 153, 0.06);
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.5;
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

const CalendarWrap = styled.div`
    position: relative;
    flex: 1;
`;

const CalendarTrigger = styled.button`
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: ${(p) => (p.$empty ? "var(--text-secondary)" : "var(--text-primary)")};
    font-family: "Inter", sans-serif;
    font-size: 12px;
    padding: 7px 10px;
    cursor: pointer;
    text-align: left;
    outline: none;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: border-color 0.15s ease, background 0.15s ease;
    &:hover {
        border-color: rgba(34, 204, 153, 0.4);
        background: rgba(34, 204, 153, 0.04);
    }
    &:focus {
        border-color: #22cc99;
    }
`;

const CalendarDropdown = styled.div`
    position: fixed;
    z-index: 9999;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    padding: 12px;

    .rdp-root {
        --rdp-accent-color: #22cc99;
        --rdp-accent-background-color: rgba(34, 204, 153, 0.15);
        --rdp-today-color: #22cc99;
        --rdp-day-height: 32px;
        --rdp-day-width: 32px;
        --rdp-day_button-height: 30px;
        --rdp-day_button-width: 30px;
        --rdp-day_button-border-radius: 6px;
        --rdp-nav_button-height: 1.75rem;
        --rdp-nav_button-width: 1.75rem;
        color: var(--text-primary);
        font-family: "Inter", sans-serif;
        font-size: 12px;
    }

    .rdp-month_caption {
        font-size: 13px;
        font-weight: 600;
    }

    .rdp-weekday {
        font-size: 10px;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .rdp-day_button:hover:not(:disabled) {
        background: rgba(34, 204, 153, 0.12);
        color: #22cc99;
    }

    .rdp-selected .rdp-day_button {
        background: #22cc99;
        color: #0d1117;
        border-color: #22cc99;
        font-weight: 700;
    }

    .rdp-chevron {
        fill: var(--text-secondary);
    }

    .rdp-button_previous:hover .rdp-chevron,
    .rdp-button_next:hover .rdp-chevron {
        fill: var(--text-primary);
    }
`;

const CalendarTimeRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 4px 2px;
    border-top: 1px solid var(--border-color);
    margin-top: 4px;
`;

const TimeInput = styled.input`
    flex: 1;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    padding: 4px 8px;
    outline: none;
    color-scheme: dark;
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

const TzPickerWrap = styled.div`
    flex: 1;
`;

const TzPickerTrigger = styled.button`
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    font-size: 12px;
    padding: 7px 10px;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: border-color 0.15s ease, background 0.15s ease;
    &:hover {
        border-color: rgba(34, 204, 153, 0.4);
        background: rgba(34, 204, 153, 0.04);
    }
`;

const TzOffsetBadge = styled.span`
    font-size: 10px;
    font-family: "JetBrains Mono", monospace;
    color: #22cc99;
    background: rgba(34, 204, 153, 0.1);
    border: 1px solid rgba(34, 204, 153, 0.2);
    border-radius: 3px;
    padding: 1px 5px;
    letter-spacing: 0.02em;
    flex-shrink: 0;
`;

const TzDropdown = styled.div`
    position: fixed;
    z-index: 9999;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 260px;
`;

const TzSearchWrap = styled.div`
    padding: 10px 10px 8px;
    border-bottom: 1px solid var(--border-color);
`;

const TzSearchInput = styled.input`
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    font-size: 12px;
    padding: 7px 10px;
    outline: none;
    box-sizing: border-box;
    &:focus {
        border-color: #22cc99;
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.5;
    }
`;

const TzList = styled.div`
    max-height: 240px;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const TzOption = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    gap: 8px;
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-primary)")};
    background: ${(p) => (p.$active ? "rgba(34, 204, 153, 0.08)" : "transparent")};
    transition: background 0.1s ease;
    &:hover {
        background: ${(p) => (p.$active ? "rgba(34, 204, 153, 0.12)" : "rgba(255,255,255,0.04)")};
    }
`;

const TzOptionOffset = styled.span`
    font-size: 10px;
    font-family: "JetBrains Mono", monospace;
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    opacity: ${(p) => (p.$active ? 1 : 0.7)};
    flex-shrink: 0;
`;

const ResultRows = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ResultRow = styled.div`
    display: flex;
    align-items: center;
    padding: 13px 16px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;
    transition: background 0.15s ease;
    &:hover {
        background: rgba(34, 204, 153, 0.03);
    }
    &:last-child {
        border-bottom: none;
    }
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
    font-size: 12.5px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    flex: 1;
    word-break: break-all;
    letter-spacing: 0.01em;
`;

const RowCopyBtn = styled.button`
    background: none;
    border: 1px solid transparent;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    padding: 4px 6px;
    border-radius: 4px;
    transition: all 0.15s ease;
    &:hover {
        color: #22cc99;
        border-color: rgba(34, 204, 153, 0.3);
        background: rgba(34, 204, 153, 0.08);
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

function TzPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef(null);
    const dropRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (triggerRef.current && !triggerRef.current.contains(e.target) && (!dropRef.current || !dropRef.current.contains(e.target))) {
                setOpen(false);
                setSearch("");
            }
        }
        function handleScroll(e) {
            if (dropRef.current && dropRef.current.contains(e.target)) return;
            setOpen(false);
            setSearch("");
        }
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    useEffect(() => {
        if (open) setTimeout(() => searchRef.current?.focus(), 30);
    }, [open]);

    useEffect(() => {
        if (open && dropRef.current) {
            const active = dropRef.current.querySelector("[data-active='true']");
            active?.scrollIntoView({ block: "nearest" });
        }
    }, [open]);

    const handleTriggerClick = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        }
        setOpen((o) => !o);
    };

    const filtered = useMemo(
        () =>
            ALL_TIMEZONES.filter(
                (tz) => tz.toLowerCase().includes(search.toLowerCase()) || TZ_OFFSETS[tz].toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    const handleSelect = (tz) => {
        onChange(tz);
        setOpen(false);
        setSearch("");
    };

    return (
        <TzPickerWrap>
            <TzPickerTrigger ref={triggerRef} onClick={handleTriggerClick}>
                <Schedule style={{ fontSize: 13, color: "#22cc99", flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {value.replace(/_/g, " ")}
                </span>
                <TzOffsetBadge>{TZ_OFFSETS[value]}</TzOffsetBadge>
                <ExpandMore
                    style={{
                        fontSize: 16,
                        color: "var(--text-secondary)",
                        flexShrink: 0,
                        transition: "transform 0.15s",
                        transform: open ? "rotate(180deg)" : "none"
                    }}
                />
            </TzPickerTrigger>
            {open &&
                ReactDOM.createPortal(
                    <TzDropdown ref={dropRef} style={{ top: dropPos.top, left: dropPos.left, width: Math.max(dropPos.width, 260) }}>
                        <TzSearchWrap>
                            <TzSearchInput
                                ref={searchRef}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search timezone or offset…"
                            />
                        </TzSearchWrap>
                        <TzList>
                            {filtered.length === 0 ? (
                                <div
                                    style={{
                                        padding: "16px 12px",
                                        fontSize: 12,
                                        color: "var(--text-secondary)",
                                        textAlign: "center",
                                        fontFamily: "Inter, sans-serif"
                                    }}
                                >
                                    No results
                                </div>
                            ) : (
                                filtered.map((tz) => (
                                    <TzOption key={tz} $active={tz === value} data-active={tz === value} onClick={() => handleSelect(tz)}>
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {tz.replace(/_/g, " ")}
                                        </span>
                                        <TzOptionOffset $active={tz === value}>{TZ_OFFSETS[tz]}</TzOptionOffset>
                                    </TzOption>
                                ))
                            )}
                        </TzList>
                    </TzDropdown>,
                    document.body
                )}
        </TzPickerWrap>
    );
}

TzPicker.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

function DateTimePicker({ onChange }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(undefined);
    const [timeStr, setTimeStr] = useState("00:00");
    const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const dropRef = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (triggerRef.current && !triggerRef.current.contains(e.target) && (!dropRef.current || !dropRef.current.contains(e.target)))
                setOpen(false);
        }
        function handleScroll() {
            setOpen(false);
        }
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    const handleTriggerClick = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropPos({ top: rect.bottom + 6, left: rect.left });
        }
        setOpen((o) => !o);
    };

    const emit = useCallback(
        (day, time) => {
            if (!day) return;
            const [h, m] = time.split(":");
            const dt = new Date(day);
            dt.setHours(parseInt(h, 10), parseInt(m, 10), 0);
            onChange(format(dt, "yyyy-MM-dd HH:mm:ss"));
        },
        [onChange]
    );

    const handleSelect = (day) => {
        setSelected(day);
        emit(day, timeStr);
    };

    const handleTime = (e) => {
        setTimeStr(e.target.value);
        emit(selected, e.target.value);
    };

    const label = selected ? `${format(selected, "dd MMM yyyy")}  ${timeStr}` : "Pick a date & time";

    return (
        <CalendarWrap>
            <CalendarTrigger ref={triggerRef} $empty={!selected} onClick={handleTriggerClick}>
                <CalendarToday style={{ fontSize: 13, opacity: 0.6, flexShrink: 0 }} />
                {label}
            </CalendarTrigger>
            {open &&
                ReactDOM.createPortal(
                    <CalendarDropdown ref={dropRef} style={{ top: dropPos.top, left: dropPos.left }}>
                        <DayPicker mode="single" selected={selected} onSelect={handleSelect} defaultMonth={selected} navLayout="around" />
                        <CalendarTimeRow>
                            <TzLabel>TIME</TzLabel>
                            <TimeInput type="time" value={timeStr} onChange={handleTime} />
                        </CalendarTimeRow>
                    </CalendarDropdown>,
                    document.body
                )}
        </CalendarWrap>
    );
}

DateTimePicker.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default function TimestampConverter() {
    const [mode, setMode] = useState("unix2date");
    const [unixInput, setUnixInput] = useState("");
    const [dateInput, setDateInput] = useState("");
    const [tz, setTz] = useState(SYSTEM_TZ);
    const [copiedLabel, setCopiedLabel] = useState(null);

    const unix2dateResult = useMemo(() => {
        if (!unixInput.trim()) return { rows: null, error: "" };
        const raw = parseInt(unixInput.trim(), 10);
        if (Number.isNaN(raw)) return { rows: null, error: L.invalidUnixTimestampError };
        const isMs = raw > 9_999_999_999;
        const ts = isMs ? Math.floor(raw / 1000) : raw;
        const m = moment.unix(ts);
        if (!m.isValid()) return { rows: null, error: L.invalidTimestampError };
        return {
            rows: [
                { label: `Timezone (${tz})`, value: formatInTz(ts, tz) },
                { label: "UTC", value: formatInTz(ts, "UTC") },
                { label: "ISO 8601", value: new Date(ts * 1000).toISOString() },
                { label: "Relative", value: moment.unix(ts).fromNow() },
                ...(isMs ? [{ label: "Input unit", value: "milliseconds (auto-detected)" }] : [])
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
                            <DateTimePicker onChange={setDateInput} />
                        </DatePickerRow>
                    )}
                    {mode === "unix2date" && (
                        <TzRow>
                            <TzLabel>{L.timezoneLabel}</TzLabel>
                            <TzPicker value={tz} onChange={setTz} />
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
