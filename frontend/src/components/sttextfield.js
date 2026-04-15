import * as React from 'react';
import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';

const options = {
  shouldForwardProp: (prop) => prop !== 'fontColor',
};

const StTextField = styled(
  TextField,
  options,
)(({ fontColor }) => ({
  input: {
    color: fontColor,
  },
}));

export default StTextField; 