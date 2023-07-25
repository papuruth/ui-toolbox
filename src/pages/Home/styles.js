import { Card } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from 'styles/colors';

const getStyles = (props) => {
  if (props.search && props.dataLength > 0) {
    return 'flex-start';
  }
  if (props.dataLength > 0) {
    return 'space-between';
  }
  return 'center';
};

export const StyledContainer = styled.div`
  background-color: ${colors.background};
  color: ${colors.primary};
  height: 100vh;
  justify-content: ${(props) => getStyles(props)};
`;

export const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px;
  flex-direction: column;
  & > svg {
    margin-bottom: 10px;
  }
`;

export const StyledLink = styled(Link)``;
