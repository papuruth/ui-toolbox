import React from 'react';
import PropTypes from 'prop-types';
import noDataImage from 'assets/images/no-results.svg';
import { Typography } from '@mui/material';
import { StyledContainer } from './styles';
import { StyledImageRenderer } from '../Styled-Components';

function NoData(props) {
  const { title } = props;
  return (
    <StyledContainer>
      <figure>
        <StyledImageRenderer src={noDataImage} alt="no-data-found" />
      </figure>
      <Typography variant="h6" fontWeight={500} color="black">
        {title}
      </Typography>
    </StyledContainer>
  );
}

NoData.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string]).isRequired,
};

export default NoData;
