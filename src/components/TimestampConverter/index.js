import { Tabs } from "@mui/base/Tabs";
import { Paper, TextField, Typography, Button } from "@mui/material";
import { StyledBoxContainer } from "components/Shared/Styled-Components";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import localization from "localization";
import moment from "moment";
import React, { useState } from "react";

const { timestampConverter: L } = localization;

const FORMATS = [
    { label: "Local", fn: (ts) => moment.unix(ts).format("YYYY-MM-DD HH:mm:ss") },
    { label: "UTC", fn: (ts) => moment.unix(ts).utc().format("YYYY-MM-DD HH:mm:ss [UTC]") },
    { label: "ISO 8601", fn: (ts) => moment.unix(ts).toISOString() },
    { label: "Relative", fn: (ts) => moment.unix(ts).fromNow() }
];

export default function TimestampConverter() {
    const [unixInput, setUnixInput] = useState("");
    const [dateInput, setDateInput] = useState("");
    const [dateResults, setDateResults] = useState(null);
    const [unixResult, setUnixResult] = useState(null);
    const [unixError, setUnixError] = useState("");
    const [dateError, setDateError] = useState("");

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
        setDateResults(FORMATS.map(({ label, fn }) => ({ label, value: fn(ts) })));
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
