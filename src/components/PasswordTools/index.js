import { Tabs } from "@mui/base/Tabs";
import PasswordGenerator from "components/PasswordGenerator";
import PasswordStrengthMeter from "components/PasswordStrengthMeter";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import React from "react";

export default function PasswordTools() {
    return (
        <Tabs defaultValue={0}>
            <StyledTabsList>
                <StyledTab value={0}>Generator</StyledTab>
                <StyledTab value={1}>Strength Meter</StyledTab>
            </StyledTabsList>
            <StyledTabPanel value={0}>
                <PasswordGenerator />
            </StyledTabPanel>
            <StyledTabPanel value={1}>
                <PasswordStrengthMeter />
            </StyledTabPanel>
        </Tabs>
    );
}
