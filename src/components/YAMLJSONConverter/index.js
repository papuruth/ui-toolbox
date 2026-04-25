import { Tabs } from "@mui/base/Tabs";
import { Button } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import { StyledTab, StyledTabPanel, StyledTabsList } from "components/Shared/StyledTabs";
import localization from "localization";
import yaml from "js-yaml";
import React, { useState } from "react";
import toast from "utils/toast";

const { yamlJsonConverter: L } = localization;

export default function YAMLJSONConverter() {
    const [yamlInput, setYamlInput] = useState("");
    const [yamlOutput, setYamlOutput] = useState("");
    const [jsonInput, setJsonInput] = useState("");
    const [jsonOutput, setJsonOutput] = useState("");

    const convertYAMLtoJSON = () => {
        try {
            const obj = yaml.load(yamlInput);
            setYamlOutput(JSON.stringify(obj, null, 2));
        } catch (e) {
            toast.error(e.message);
        }
    };

    const convertJSONtoYAML = () => {
        try {
            const obj = JSON.parse(jsonInput);
            setJsonOutput(yaml.dump(obj));
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <Tabs defaultValue={0}>
            <StyledTabsList>
                <StyledTab value={0}>{L.yamlToJsonTab}</StyledTab>
                <StyledTab value={1}>{L.jsonToYamlTab}</StyledTab>
            </StyledTabsList>
            <StyledTabPanel value={0}>
                <StyledBoxContainer flexDirection="column" gap={2} sx={{ pt: 2 }}>
                    <StyledTextField
                        multiline
                        rows={8}
                        placeholder={L.yamlInputPlaceholder}
                        value={yamlInput}
                        onChange={(e) => setYamlInput(e.target.value)}
                    />
                    <Button variant="contained" onClick={convertYAMLtoJSON} sx={{ alignSelf: "flex-start" }}>
                        {L.convertToJsonBtn}
                    </Button>
                    {yamlOutput && (
                        <StyledTextField
                            multiline
                            rows={8}
                            value={yamlOutput}
                            label={L.jsonOutputLabel}
                            onChange={() => {}}
                            InputProps={{ readOnly: true }}
                        />
                    )}
                </StyledBoxContainer>
            </StyledTabPanel>
            <StyledTabPanel value={1}>
                <StyledBoxContainer flexDirection="column" gap={2} sx={{ pt: 2 }}>
                    <StyledTextField
                        multiline
                        rows={8}
                        placeholder={L.jsonInputPlaceholder}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    />
                    <Button variant="contained" onClick={convertJSONtoYAML} sx={{ alignSelf: "flex-start" }}>
                        {L.convertToYamlBtn}
                    </Button>
                    {jsonOutput && (
                        <StyledTextField
                            multiline
                            rows={8}
                            value={jsonOutput}
                            label={L.yamlOutputLabel}
                            onChange={() => {}}
                            InputProps={{ readOnly: true }}
                        />
                    )}
                </StyledBoxContainer>
            </StyledTabPanel>
        </Tabs>
    );
}
