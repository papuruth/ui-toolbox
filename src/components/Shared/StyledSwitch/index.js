import { FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import { bool, func, string } from "prop-types";
import { Android12Switch } from "./styles";

export default function StyledSwitch({ label, checked, onChange, disabled }) {
    return (
        <FormGroup>
            <FormControlLabel
                sx={{ ml: 0 }}
                control={<Android12Switch checked={checked} onChange={onChange} />}
                label={label}
                labelPlacement="start"
                componentsProps={{
                    typography: { fontWeight: 500, mr: 2 }
                }}
                disabled={disabled}
            />
        </FormGroup>
    );
}

StyledSwitch.defaultProps = {
    disabled: false
};

StyledSwitch.propTypes = {
    label: string.isRequired,
    checked: bool.isRequired,
    onChange: func.isRequired,
    disabled: bool
};
