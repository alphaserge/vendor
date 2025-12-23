import * as React from 'react';
import { makeStyles, withStyles } from '@mui/styles';

import { Button } from "@mui/material";

export default withStyles({
  root: {
    borderRadius: '18px ! important',
    backgroundColor: '#fff ! important',
    color: '#222 ! important',
    fontSize: '15px ! important',
    textTransform: 'none ! important',
    padding: '6px 20px ! important',
    border: '1px solid #222 ! important',
    '&:hover': {
      backgroundColor: '#fd8bb5!important',
      color: '#fff',
  },
  '&:disabled': {
      backgroundColor: '#aaa!important',
  },
}})(Button);
  
