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
    border: 'none',
    boxShadow:"rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px, rgba(167, 171, 174, 0.15) 4px 0px 0px 2px",
    '&:hover': {
      backgroundColor: '#fd8bb5!important',
      color: '#fff',
  },
  '&:disabled': {
      backgroundColor: '#aaa!important',
  },
}})(Button);
  
