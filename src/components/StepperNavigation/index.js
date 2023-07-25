import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { string } from 'prop-types';
import { StyledContainer, StyledLink } from './styles';

export default function StepperNavigation({ currentView }) {
  return (
    <StyledContainer>
      <Breadcrumbs aria-label="breadcrumb">
        <StyledLink to="/">Home</StyledLink>
        <Typography color="text.primary">{currentView}</Typography>
      </Breadcrumbs>
    </StyledContainer>
  );
}

StepperNavigation.propTypes = {
  currentView: string.isRequired
}
