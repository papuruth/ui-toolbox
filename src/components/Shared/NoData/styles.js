import styled from 'styled-components';
import colors from 'styles/colors';

export const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-flow: column;
  max-width: 500px;
  margin: 0 auto;
  padding: 70px 10px;
  position: relative;

  min-height: 400px;

  & > figure {
    margin-bottom: 15px;
  }

  & > h1 {
    font-size: 17px;
    color: ${colors.black};
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 15px;
  }
`;
