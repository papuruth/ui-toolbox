import styled from 'styled-components';

import colors from 'styles/colors';

export const StyledContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${colors.darker};
  color: ${colors.light};
  width: 100%;
  height: 30px;
  bottom: 0;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  background-color: #1976d2;
`;
