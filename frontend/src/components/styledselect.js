import * as React from 'react';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';

const options = {
  shouldForwardProp: (prop) => prop !== 'fontColor',
};

const StyledSelect = styled(
  Select,
  options,
)(({ fontColor }) => ({

    color: fontColor,
  
}));

export default StyledSelect; 