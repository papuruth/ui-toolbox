import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import PropTypes, { string } from "prop-types";
import { StyledContainer, StyledLink } from "./styles";

export default function StepperNavigation({ currentView, category }) {
    return (
        <StyledContainer>
            <Breadcrumbs aria-label="breadcrumb">
                <StyledLink to="/">Home</StyledLink>
                {category ? (
                    <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                        {category.label}
                    </Typography>
                ) : null}
                <Typography color="text.primary">{currentView}</Typography>
            </Breadcrumbs>
        </StyledContainer>
    );
}

StepperNavigation.defaultProps = {
    category: null
};

StepperNavigation.propTypes = {
    currentView: string.isRequired,
    category: PropTypes.shape({
        id: string,
        label: string,
        color: string
    })
};
