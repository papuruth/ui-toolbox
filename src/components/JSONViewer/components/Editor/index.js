import { StyledBoxContainer, StyledButton } from "components/Shared/Styled-Components";
import StyledTextArea from "components/Shared/StyledTextArea";
import { func, string } from "prop-types";
import React from "react";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";

const { JSON_EDITOR_CTA } = GLOBAL_CONSTANTS;
export default function Editor({ handleJSONInput, jsonInput, handleEditorOperations }) {
    return (
        <StyledBoxContainer flexDirection="column">
            <StyledBoxContainer gap={1}>
                {JSON_EDITOR_CTA.map((cta) => (
                    <StyledButton variant="outlined" key={cta.id} onClick={() => handleEditorOperations(cta.id)}>
                        {cta.label}
                    </StyledButton>
                ))}
            </StyledBoxContainer>
            <StyledBoxContainer flexDirection="column" height="calc(100vh - 410px)">
                <StyledTextArea
                    sx={{ height: "100% !important", width: "100%", mt: 1 }}
                    placeholder="Paste JSON code here..."
                    value={jsonInput}
                    onChange={handleJSONInput}
                />
            </StyledBoxContainer>
        </StyledBoxContainer>
    );
}

Editor.propTypes = {
    handleJSONInput: func.isRequired,
    jsonInput: string.isRequired,
    handleEditorOperations: func.isRequired
};
