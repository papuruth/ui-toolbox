import { Tabs } from "@mui/base/Tabs";
import Base64ToImage from "components/Base64ToImage";
import ImageToBase64 from "components/ImageToBase64";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import React from "react";

export default function Base64Image() {
    return (
        <Tabs defaultValue={0}>
            <StyledTabsList>
                <StyledTab value={0}>Image to Base64</StyledTab>
                <StyledTab value={1}>Base64 to Image</StyledTab>
            </StyledTabsList>
            <StyledTabPanel value={0}>
                <ImageToBase64 />
            </StyledTabPanel>
            <StyledTabPanel value={1}>
                <Base64ToImage />
            </StyledTabPanel>
        </Tabs>
    );
}
