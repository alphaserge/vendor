import * as React from 'react';
import { makeStyles, withStyles } from '@mui/styles';

import { Button } from "@mui/material";

export default withStyles({
  root: {
    borderRadius: '0!important',
    border: '1px solid #888!important',
    backgroundColor: '#fff!important',
    color: '#333!important',
    fontSize: "15px!important",
    textTransform: "none!important",
    padding: "4px 12px!important",
    '&:hover': {
      backgroundColor: '#888!important',
      color: '#fff',
  },
  '&:disabled': {
      color: '#ccc!important',
  },
}})(Button);
  
