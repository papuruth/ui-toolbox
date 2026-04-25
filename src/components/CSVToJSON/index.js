import { Button, FormControlLabel, Switch } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import Papa from "papaparse";
import React, { useState } from "react";
import toast from "utils/toast";

const { csvToJson: L } = localization;

export default function CSVToJSON() {
    const [csvInput, setCsvInput] = useState("");
    const [jsonOutput, setJsonOutput] = useState("");
    const [hasHeader, setHasHeader] = useState(true);

    const convert = () => {
        if (!csvInput.trim()) {
            toast.error(L.emptyInputError);
            return;
        }
        try {
            const result = Papa.parse(csvInput.trim(), { header: hasHeader, skipEmptyLines: true });
            if (result.errors.length) {
                toast.error(result.errors[0].message);
            }
            setJsonOutput(JSON.stringify(result.data, null, 2));
        } catch (e) {
            toast.error(e.message);
        }
    };

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
