import { Checkbox, Chip, FormControlLabel, Paper } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer, StyledText, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization/index";
import { capitalize, debounce } from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import colors from "styles/colors";
import { formatNumberToUnits } from "utils/helperFunctions";
import zxcvbn from "zxcvbn";
import { StyledPasswordInputContainer } from "./styles";

const { passwordStrengthMeter } = localization;

export default function PasswordStrengthMeter() {
    const [password, setPassword] = useState("");
    const [passwordStrengthDetails, setPasswordStrengthDetails] = useState(null);
    const [showPasword, setShowPassword] = useState(false);

    const handlePasswordMeter = useCallback(() => {
        if (!password) {
            setPasswordStrengthDetails(null);
            return;
        }
        const strengthDetails = zxcvbn(password);
        const { crack_times_seconds } = strengthDetails || {};
        const { online_no_throttling_10_per_second } = crack_times_seconds || {};
        const hashingTime = online_no_throttling_10_per_second;
        const secondsInYear = 365.5 * 24 * 60 * 60;
        const secondsInMonth = 30 * 24 * 60 * 60;
        const secondsInWeek = 7 * 24 * 60 * 60;
        const secondsInDay = 24 * 60 * 60;
        const secondsInHour = 60 * 60;
        let cractTime = 0;
        let unit = "";
        if (hashingTime >= secondsInYear) {
            cractTime = moment.duration(hashingTime, "seconds").asYears();
            unit = cractTime > 1 ? "years" : "year";
        } else if (hashingTime >= secondsInMonth) {
            cractTime = moment.duration(hashingTime, "seconds").asMonths();
            unit = cractTime > 1 ? "months" : "month";
        } else if (hashingTime >= secondsInWeek) {
            cractTime = moment.duration(hashingTime, "seconds").asWeeks();
            unit = cractTime > 1 ? "weeks" : "week";
        } else if (hashingTime >= secondsInDay) {
            cractTime = moment.duration(hashingTime, "seconds").asDays();
            unit = cractTime > 1 ? "days" : "day";
        } else if (hashingTime >= secondsInHour) {
            cractTime = moment.duration(hashingTime, "seconds").asHours();
            unit = cractTime > 1 ? "hours" : "hour";
        } else {
            cractTime = moment.duration(hashingTime, "seconds").asSeconds();
            unit = cractTime > 1 ? "seconds" : "second";
        }
        const Text_A_Z_REGEX = /[A-Z]/;
        const Text_a_z_REGEX = /[a-z]/;
        const NUMBERS_REGEX = /[0-9]/;
        const SYMBOLS_REGEX = /[!#$%&*+-.@^_~%()=`[\]{}|\\/.>,<:;"'+=?]/;

        const passwordStrength = {
            score: strengthDetails.score,
            crackTime: `${formatNumberToUnits(Math.round(cractTime), true)} ${capitalize(unit)}`,
            hasUpperCase: Text_A_Z_REGEX.test(password),
            hasLowerCase: Text_a_z_REGEX.test(password),
            hasNumbers: NUMBERS_REGEX.test(password),
            hasSymbols: SYMBOLS_REGEX.test(password)
        };
        setPasswordStrengthDetails(passwordStrength);
    }, [password]);

    useEffect(() => {
        const debobouncedFn = debounce(handlePasswordMeter, 500);
        debobouncedFn();
    }, [password, handlePasswordMeter]);

    const getPasswordStrength = () => {
        switch (passwordStrengthDetails?.score) {
            case 0:
            case 1:
                return passwordStrengthMeter.weak;
            case 2:
                return passwordStrengthMeter.medium;
            case 3:
                return passwordStrengthMeter.strong;
            case 4:
                return passwordStrengthMeter.veryStrong;
            default:
                return null;
        }
    };

    const { crackTime, score, hasUpperCase, hasLowerCase, hasNumbers, hasSymbols } = passwordStrengthDetails || {};
    return (
        <StyledBoxCenter flexDirection="column" justifyContent="center" marginTop={4} gap={3}>
            <Paper sx={{ display: "flex", flexDirection: "column", width: { xs: "100%", sm: "100%", md: "50%" }, justifyContent: "center", p: 3 }}>
                <StyledBoxCenter justifyContent="center" flexDirection="column" gap={1}>
                    <StyledBoxCenter justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }} gap={1} marginTop={2}>
                        <StyledText sx={{ mr: 3 }}>
                            <b>Tip:</b>
                            &nbsp; Strong password uses different types of characters
                        </StyledText>
                        <FormControlLabel
                            labelPlacement="start"
                            label="Show password"
                            control={<Checkbox sx={{ ml: 1 }} checked={showPasword} onChange={(e) => setShowPassword(e.target.checked)} />}
                        />
                    </StyledBoxCenter>
                    <StyledBoxCenter justifyContent="center">
                        <StyledPasswordInputContainer
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            gap={1}
                            $marginLeft="5px"
                            bgcolor="red"
                            width={600}
                        >
                            <StyledTextField
                                fullWidth
                                type={showPasword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={passwordStrengthMeter.passwordFieldPlaceholderText}
                                size="small"
                                sx={{ background: colors.white, textAlign: "center" }}
                                slotProps={{
                                    htmlInput: {
                                        style: { textAlign: "center", padding: 10 }
                                    }
                                }}
                                variant="filled"
                            />
                            {score >= 0 ? (
                                <StyledText>
                                    <b>{getPasswordStrength()}</b>
                                </StyledText>
                            ) : (
                                <StyledText>
                                    <b>No Password</b>
                                </StyledText>
                            )}
                        </StyledPasswordInputContainer>
                    </StyledBoxCenter>
                    <StyledBoxCenter
                        justifyContent="space-between"
                        width={600}
                        sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}
                        gap={1}
                    >
                        <StyledText sx={{ minWidth: 220 }}>
                            <b>{password?.length} characters containing:</b>
                        </StyledText>
                        <StyledBoxContainer justifyContent="space-between">
                            <Chip label="Uppercase" disabled={!hasUpperCase} color={hasUpperCase ? "success" : "default"} />
                            <Chip label="Lowercase" disabled={!hasLowerCase} color={hasLowerCase ? "success" : "default"} />
                            <Chip label="Numbers" disabled={!hasNumbers} color={hasNumbers ? "success" : "default"} />
                            <Chip label="Symbols" disabled={!hasSymbols} color={hasSymbols ? "success" : "default"} />
                        </StyledBoxContainer>
                    </StyledBoxCenter>
                </StyledBoxCenter>
                {score >= 0 ? (
                    <StyledBoxCenter justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }} gap={1} marginTop={2}>
                        <StyledBoxContainer width={520}>
                            <StyledText sx={{ mr: 3, minWidth: 181 }}>Time to crack your password:</StyledText>
                            <StyledText>{crackTime}</StyledText>
                        </StyledBoxContainer>
                    </StyledBoxCenter>
                ) : null}
                <StyledBoxCenter
                    justifyContent="center"
                    sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}
                    gap={1}
                    marginTop={password ? 2 : 0}
                />
            </Paper>
        </StyledBoxCenter>
    );
}
