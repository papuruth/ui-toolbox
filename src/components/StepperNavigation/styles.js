import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from 'styles/colors';

export const StyledContainer = styled(Paper)`
  padding: 10px 40px;
  margin: 0 40px;
`;

export const StyledLink = styled(Link)`
  font-weight: 500;
  color: ${colors.primary};
`;
