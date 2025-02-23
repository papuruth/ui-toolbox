/* eslint-disable react/no-array-index-key */
import { ContentCopy } from "@mui/icons-material";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Tooltip
} from "@mui/material";
import { StyledText } from "components/DecodeBase64/styles";
import { StyledBoxCenter, StyledBoxContainer, StyledButton } from "components/Shared/Styled-Components";
import StyledNumberInput from "components/Shared/StyledNumberInput";
import localization from "localization/index";
import { filter, keys, reduce } from "lodash";
import React, { useState } from "react";
import colors from "styles/colors";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import { getRandomNumbers, passwordGenerator } from "utils/helperFunctions";
import zxcvbn from "zxcvbn";

const { PASSWORD_GEN_LIST } = GLOBAL_CONSTANTS;
const {
    passwordGen,
    common: { copiedToCP, copyToCP }
} = localization;

export default function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [copyTooltip, setCopyTooltip] = useState(copyToCP);
    const [passwordLength, setPasswordLength] = useState(8);
    const [passwordScore, setPasswordScore] = useState(0);
    const [compositionRule, setCompositionRule] = useState({
        upperCase: { min: 2, forbidden: false },
        lowerCase: { min: 2, forbidden: false },
        numbers: { min: 2, forbidden: false },
        symbols: { min: 2, forbidden: false }
    });

    const handleCopyToClipBoard = () => {
        if (window && window.navigator.clipboard) {
            window.navigator.clipboard.writeText(password).then(() => {
                setCopyTooltip(copiedToCP);
            });
        }
    };

    const handlePasswordGenerate = () => {
        const pswdString = passwordGenerator(passwordLength, compositionRule, PASSWORD_GEN_LIST);
        setPassword(pswdString);
        const passwordStrength = zxcvbn(pswdString);
        setPasswordScore(passwordStrength.score);
    };

    const resetState = () => {
        setPassword("");
    };

    const handleCompositionChange = ({ target: { name, checked } }) => {
        setCompositionRule((prevState) => {
            prevState[name].forbidden = !checked;
            const updatedCompositionRules = getUpdatedCompositionRules(passwordLength, prevState);
            return { ...updatedCompositionRules };
        });
    };

    const handleCompositionLength = ({ target: { name, value } }) => {
        setCompositionRule((prevState) => {
            prevState[name].min = Number(value);
            return { ...prevState };
        });
    };

    const getUpdatedCompositionRules = (value, rules) => {
        const updatedCompositionRules = { ...rules };
        const compositionKeys = filter(keys(updatedCompositionRules), (key) => !updatedCompositionRules[key].forbidden);
        const flagEnabledLen = reduce(
            compositionKeys,
            (acc, curr) => {
                if (!updatedCompositionRules[curr].forbidden) {
                    // eslint-disable-next-line no-param-reassign
                    acc += 1;
                }
                return acc;
            },
            0
        );
        const factor = value / flagEnabledLen;
        const randomIndex = getRandomNumbers(0, 3);
        for (let i = 0; i < flagEnabledLen; i += 1) {
            if (value % flagEnabledLen !== 0 && randomIndex === i) {
                updatedCompositionRules[compositionKeys[i]].min = Math.floor(factor) + (value % flagEnabledLen);
            } else {
                updatedCompositionRules[compositionKeys[i]].min = Math.floor(factor);
            }
        }
        return updatedCompositionRules;
    };

    const handlePasswordLength = (...args) => {
        const value = args[1];
        const updatedCompositionRules = getUpdatedCompositionRules(value, compositionRule);
        setCompositionRule(updatedCompositionRules);
        setPasswordLength(value);
    };

    const getPasswordStrength = () => {
        switch (passwordScore) {
            case 0:
            case 1:
            case 2:
                return "Weak";
            case 3:
                return "Strong";
            case 4:
                return "Very Strong";
            default:
                return null;
        }
    };

    return (
        <StyledBoxCenter flexDirection="column" justifyContent="center" marginTop={4} gap={3}>
            <Paper sx={{ display: "flex", flexDirection: "column", width: { xs: "100%", sm: "100%", md: "50%" }, justifyContent: "center", p: 3 }}>
                <StyledBoxCenter justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }} gap={1}>
                    <FormGroup sx={{ flexDirection: "row", alignItems: "center", minWidth: 520 }}>
                        <FormLabel sx={{ mr: 3, minWidth: 181 }} color="info" required htmlFor="passwordLength">
                            Password length:
                        </FormLabel>
                        <FormGroup>
                            <FormControl sx={{ minHeight: 40 }} size="small">
                                <StyledNumberInput
                                    aria-label="passwordLength"
                                    placeholder={passwordGen.passwordFieldPlaceholderText}
                                    max={32}
                                    min={8}
                                    id="passwordLength"
                                    name="passwordLength"
                                    value={passwordLength}
                                    onChange={handlePasswordLength}
                                />
                            </FormControl>
                        </FormGroup>
                    </FormGroup>
                </StyledBoxCenter>
                <StyledBoxCenter justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }} gap={1}>
                    <FormGroup sx={{ flexDirection: "row", alignItems: "center", minHeight: 250, minWidth: 520 }}>
                        <FormLabel component="legend" sx={{ mr: 3 }} color="info" required>
                            Password composition:
                        </FormLabel>
                        <FormGroup sx={{ minHeight: 225 }}>
                            <StyledBoxCenter>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="upperCase"
                                            onChange={handleCompositionChange}
                                            checked={!compositionRule.upperCase.forbidden}
                                        />
                                    }
                                    label="Uppercase"
                                    sx={{ width: 120 }}
                                />
                                {!compositionRule.upperCase.forbidden ? (
                                    <FormControl sx={{ m: 1, minWidth: 65, minHeight: 40 }} size="small">
                                        <InputLabel id="upperCaseLength">Min</InputLabel>
                                        <Select
                                            name="upperCase"
                                            labelId="upperCaseLength"
                                            value={compositionRule.upperCase.min}
                                            label="Length"
                                            onChange={handleCompositionLength}
                                            autoWidth
                                        >
                                            {new Array(10).fill(null).map((_, index) => (
                                                <MenuItem value={index + 1} key={`upperCaseLength-${index}`}>
                                                    {index + 1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : null}
                            </StyledBoxCenter>
                            <StyledBoxCenter>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="lowerCase"
                                            onChange={handleCompositionChange}
                                            checked={!compositionRule.lowerCase.forbidden}
                                        />
                                    }
                                    label="LowerCase"
                                    sx={{ width: 120 }}
                                />
                                {!compositionRule.lowerCase.forbidden ? (
                                    <FormControl sx={{ m: 1, minWidth: 65, minHeight: 40 }} size="small">
                                        <InputLabel id="lowerCaseLength">Min</InputLabel>
                                        <Select
                                            name="lowerCase"
                                            labelId="lowerCaseLength"
                                            value={compositionRule.lowerCase.min}
                                            label="Length"
                                            onChange={handleCompositionLength}
                                            autoWidth
                                        >
                                            {new Array(10).fill(null).map((_, index) => (
                                                <MenuItem value={index + 1} key={`lowerCaseLength-${index}`}>
                                                    {index + 1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : null}
                            </StyledBoxCenter>
                            <StyledBoxCenter>
                                <FormControlLabel
                                    control={
                                        <Checkbox name="numbers" onChange={handleCompositionChange} checked={!compositionRule.numbers.forbidden} />
                                    }
                                    label="Numbers"
                                    sx={{ width: 120 }}
                                />
                                {!compositionRule.numbers.forbidden ? (
                                    <FormControl sx={{ m: 1, minWidth: 65, minHeight: 40 }} size="small">
                                        <InputLabel id="numbersLength">Min</InputLabel>
                                        <Select
                                            name="numbers"
                                            labelId="numbersLength"
                                            value={compositionRule.numbers.min}
                                            label="Length"
                                            onChange={handleCompositionLength}
                                            autoWidth
                                        >
                                            {new Array(10).fill(null).map((_, index) => (
                                                <MenuItem value={index + 1} key={`numbersLength-${index}`}>
                                                    {index + 1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : null}
                            </StyledBoxCenter>
                            <StyledBoxCenter>
                                <FormControlLabel
                                    control={
                                        <Checkbox name="symbols" onChange={handleCompositionChange} checked={!compositionRule.symbols.forbidden} />
                                    }
                                    label="Symbols"
                                    sx={{ width: 120 }}
                                />
                                {!compositionRule.symbols.forbidden ? (
                                    <FormControl sx={{ m: 1, minWidth: 65, minHeight: 40 }} size="small">
                                        <InputLabel id="symbolsLength">Min</InputLabel>
                                        <Select
                                            name="symbols"
                                            labelId="symbolsLength"
                                            value={compositionRule.symbols.min}
                                            label="Length"
                                            onChange={handleCompositionLength}
                                            autoWidth
                                        >
                                            {new Array(10).fill(null).map((_, index) => (
                                                <MenuItem value={index + 1} key={`symbolsLength-${index}`}>
                                                    {index + 1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : null}
                            </StyledBoxCenter>
                        </FormGroup>
                    </FormGroup>
                </StyledBoxCenter>
                {password ? (
                    <StyledBoxCenter justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }} gap={1}>
                        <StyledBoxContainer width={520} alignItems="center">
                            <StyledText sx={{ mr: 3, minWidth: 181 }}>Generated password:</StyledText>
                            <StyledText sx={{ background: colors.black, color: colors.primary, borderRadius: 1, padding: 1 }}>{password}</StyledText>
                            <Tooltip
                                title={copyTooltip}
                                onMouseLeave={() => {
                                    setTimeout(() => setCopyTooltip(copyToCP), 1000);
                                }}
                            >
                                <IconButton onClick={() => handleCopyToClipBoard()}>
                                    <ContentCopy color="primary" />
                                </IconButton>
                            </Tooltip>
                        </StyledBoxContainer>
                    </StyledBoxCenter>
                ) : null}
                {password ? (
                    <StyledBoxCenter justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }} gap={1} marginTop={2}>
                        <StyledBoxContainer width={520}>
                            <StyledText sx={{ mr: 3, minWidth: 181 }}>Password strength:</StyledText>
                            <StyledText>{getPasswordStrength()}</StyledText>
                        </StyledBoxContainer>
                    </StyledBoxCenter>
                ) : null}
                <StyledBoxCenter
                    justifyContent="center"
                    sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}
                    gap={1}
                    marginTop={password ? 2 : 0}
                >
                    <StyledText component="div">
                        <StyledButton sx={{ width: 200 }} variant="outlined" onClick={handlePasswordGenerate}>
                            Generate
                        </StyledButton>
                    </StyledText>
                    <StyledText component="div">
                        <StyledButton sx={{ width: 200 }} variant="outlined" onClick={resetState} disabled={!password}>
                            Reset
                        </StyledButton>
                    </StyledText>
                </StyledBoxCenter>
            </Paper>
        </StyledBoxCenter>
    );
}
