import { Tabs } from "@mui/base/Tabs";
import DecodeBase64 from "components/DecodeBase64";
import EncodeBase64 from "components/EncodeBase64";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import React from "react";

export default function Base64Text() {
    return (
        <Tabs defaultValue={0}>
            <StyledTabsList>
                <StyledTab value={0}>Encode</StyledTab>
                <StyledTab value={1}>Decode</StyledTab>
            </StyledTabsList>
            <StyledTabPanel value={0}>
                <EncodeBase64 />
            </StyledTabPanel>
            <StyledTabPanel value={1}>
                <DecodeBase64 />
            </StyledTabPanel>
        </Tabs>
    );
}
