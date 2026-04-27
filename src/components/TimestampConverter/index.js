import { Tabs } from "@mui/base/Tabs";
import { Autocomplete, Button, Paper, TextField, Typography } from "@mui/material";
import { StyledBoxContainer } from "components/Shared/Styled-Components";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import localization from "localization";
import moment from "moment";
import React, { useState } from "react";

const { timestampConverter: L } = localization;

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

export default function TimestampConverter() {
    const [unixInput, setUnixInput] = useState("");
    const [dateInput, setDateInput] = useState("");
    const [dateResults, setDateResults] = useState(null);
    const [unixResult, setUnixResult] = useState(null);
    const [unixError, setUnixError] = useState("");
    const [dateError, setDateError] = useState("");
    const [tz, setTz] = useState("UTC");

    const getFormats = (ts) => [
        { label: `Timezone (${tz})`, value: formatInTz(ts, tz) },
        { label: "UTC", value: formatInTz(ts, "UTC") },
        { label: "ISO 8601", value: new Date(ts * 1000).toISOString() },
        { label: "Relative", value: moment.unix(ts).fromNow() }
    ];

    const convertUnixToDate = () => {
        setUnixError("");
        setDateResults(null);
        const ts = parseInt(unixInput, 10);
        if (Number.isNaN(ts)) {
            setUnixError(L.invalidUnixError);
            return;
        }
        const m = moment.unix(ts);
        if (!m.isValid()) {
            setUnixError(L.invalidTimestampError);
            return;
        }
        setDateResults(getFormats(ts));
    };

    const convertDateToUnix = () => {
        setDateError("");
        setUnixResult(null);
        const m = moment(dateInput);
        if (!m.isValid()) {
            setDateError(L.invalidDateError);
            return;
        }
        setUnixResult({ unix: m.unix(), ms: m.valueOf() });
    };

    return (
        <Tabs defaultValue={0}>
            <StyledTabsList>
                <StyledTab value={0}>{L.unixToDateTab}</StyledTab>
                <StyledTab value={1}>{L.dateToUnixTab}</StyledTab>
            </StyledTabsList>

            <Autocomplete
                options={ALL_TIMEZONES}
                value={tz}
                onChange={(_, val) => setTz(val || "UTC")}
                renderInput={(params) => <TextField {...params} label="Timezone" size="small" sx={{ mt: 2, maxWidth: 320 }} />}
                disableClearable
                size="small"
            />

            <StyledTabPanel value={0}>
                <StyledBoxContainer flexDirection="column" gap={2} sx={{ pt: 2 }}>
                    <TextField
                        label={L.unixInputLabel}
                        value={unixInput}
                        onChange={(e) => setUnixInput(e.target.value)}
                        error={!!unixError}
                        helperText={unixError || " "}
                        type="number"
                        sx={{ maxWidth: 320 }}
                    />
                    <Button variant="contained" onClick={convertUnixToDate} sx={{ alignSelf: "flex-start" }}>
                        {L.convertBtn}
                    </Button>
                    {dateResults &&
                        dateResults.map(({ label, value }) => (
                            <Paper key={label} variant="outlined" sx={{ p: 1.5, background: "var(--bg-card)" }}>
                                <Typography variant="caption" color="text.secondary">
                                    {label}
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: "monospace", mt: 0.25 }}>
                                    {value}
                                </Typography>
                            </Paper>
                        ))}
                </StyledBoxContainer>
            </StyledTabPanel>

            <StyledTabPanel value={1}>
                <StyledBoxContainer flexDirection="column" gap={2} sx={{ pt: 2 }}>
                    <TextField
                        label={L.dateInputLabel}
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        placeholder={L.dateInputPlaceholder}
                        error={!!dateError}
                        helperText={dateError || " "}
                        sx={{ maxWidth: 400 }}
                    />
                    <Button variant="contained" onClick={convertDateToUnix} sx={{ alignSelf: "flex-start" }}>
                        {L.convertBtn}
                    </Button>
                    {unixResult && (
                        <>
                            <Paper variant="outlined" sx={{ p: 1.5, background: "var(--bg-card)" }}>
                                <Typography variant="caption" color="text.secondary">
                                    {L.unixSecondsLabel}
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: "monospace", mt: 0.25 }}>
                                    {unixResult.unix}
                                </Typography>
                            </Paper>
                            <Paper variant="outlined" sx={{ p: 1.5, background: "var(--bg-card)" }}>
                                <Typography variant="caption" color="text.secondary">
                                    {L.millisecondsLabel}
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: "monospace", mt: 0.25 }}>
                                    {unixResult.ms}
                                </Typography>
                            </Paper>
                        </>
                    )}
                </StyledBoxContainer>
            </StyledTabPanel>
        </Tabs>
    );
}
