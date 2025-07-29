import * as React from 'react';
import { withStyles } from '@mui/styles';

import TextField from '@mui/material/TextField';

import {APPEARANCE as ap} from '../appearance';

export default withStyles({
  root: {
  '& label.Mui-focused': {
      color: '#222',
  },
  '& .MuiOutlinedInput-root': {
      borderRadius: '0px',
  
  '&.Mui-focused fieldset': {
      borderColor: '#888',
      borderWidth: '1px'
  },},
}})(TextField);
 
