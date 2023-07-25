import { Box, Divider, Paper, TextField } from '@mui/material';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';

export const StyledImagePreviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 20px;
  text-align: center;
  border-right: ${(props) => (props.borderRight ? '1px solid #000' : '')};
`;

const getBoxWidth = (props) => {
  const { width } = props || {};
  if (typeof width === 'number') {
    return `${width}px`;
  }
  if (typeof width === 'string') {
    return width;
  }
  return '100%';
};

export const StyledBoxCenter = styled(Box)`
  display: flex;
  align-items: center;
  width: ${(props) => getBoxWidth(props)};
  height: 100%;
  margin: auto;
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop * 8}px` : 'auto')};
`;

export const StyledPaperCenter = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
  height: ${(props) => (props.height ? `${props.height}px` : '100%')};
  flex-direction: column;
`;

const getImageHeight = (props) => {
  if (props.sameDimensions && props.width) {
    return props.width;
  }
  if (props.height) {
    return props.height;
  }
  return '100%';
};

export const StyledImageRenderer = styled.img`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => getImageHeight(props)};
  object-fit: fill;
`;

export const StyledDivider = styled(Divider)`
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
`;

export const StyledTextField = muiStyled(TextField)({
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'black',
    borderWidth: '1px',
  },
  '&[readonly="read-only"]': {
    pointerEvents: 'none',
  },
});
