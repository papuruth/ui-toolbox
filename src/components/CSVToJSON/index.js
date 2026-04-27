import { Button, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import Papa from "papaparse";
import React, { useState } from "react";
import toast from "utils/toast";

const { csvToJson: L } = localization;

export default function CSVToJSON() {
    const [csvInput, setCsvInput] = useState("");
    const [jsonOutput, setJsonOutput] = useState("");
    const [tableData, setTableData] = useState(null);
    const [hasHeader, setHasHeader] = useState(true);
    const [showTable, setShowTable] = useState(true);

    const convert = () => {
        if (!csvInput.trim()) {
            toast.error(L.emptyInputError);
            return;
        }
        try {
            const result = Papa.parse(csvInput.trim(), { header: hasHeader, skipEmptyLines: true });
            if (result.errors.length) toast.error(result.errors[0].message);
            setJsonOutput(JSON.stringify(result.data, null, 2));
            setTableData(result.data);
        } catch (e) {
            toast.error(e.message);
        }
    };

    const columns = tableData?.length ? Object.keys(tableData[0]) : [];
    const previewRows = tableData?.slice(0, 10) || [];

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledTextField multiline rows={8} placeholder={L.inputPlaceholder} value={csvInput} onChange={(e) => setCsvInput(e.target.value)} />
            <FormControlLabel
                control={<Switch checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />}
                label={L.firstRowHeaderLabel}
            />
            <Button variant="contained" onClick={convert} sx={{ alignSelf: "flex-start" }}>
                {L.convertBtn}
            </Button>

            {tableData && (
                <>
                    <FormControlLabel
                        control={<Switch checked={showTable} onChange={(e) => setShowTable(e.target.checked)} />}
                        label="Table preview"
                    />
                    {showTable && columns.length > 0 && (
                        <Paper variant="outlined" sx={{ background: "var(--bg-card)", overflow: "hidden" }}>
                            <Typography variant="caption" color="text.secondary" sx={{ p: 1.5, display: "block" }}>
                                Showing {previewRows.length} of {tableData.length} rows
                            </Typography>
                            <TableContainer sx={{ maxHeight: 340 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((col) => (
                                                <TableCell
                                                    key={col}
                                                    sx={{
                                                        background: "var(--bg-card)",
                                                        fontWeight: 700,
                                                        color: "#22cc99",
                                                        borderBottom: "2px solid var(--border-color)",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    {col}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {previewRows.map((row, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <TableRow key={i} sx={{ "&:nth-of-type(even)": { background: "rgba(255,255,255,0.02)" } }}>
                                                {columns.map((col) => (
                                                    <TableCell
                                                        key={col}
                                                        sx={{
                                                            fontFamily: "monospace",
                                                            fontSize: "0.8rem",
                                                            color: "text.primary",
                                                            borderBottom: "1px solid var(--border-color)"
                                                        }}
                                                    >
                                                        {String(row[col] ?? "")}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </>
            )}

            {jsonOutput && (
                <StyledTextField
                    multiline
                    rows={10}
                    value={jsonOutput}
                    label={L.jsonOutputLabel}
                    onChange={() => {}}
                    InputProps={{ readOnly: true }}
                />
            )}
        </StyledBoxContainer>
    );
}
