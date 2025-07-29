import * as React from 'react';
import { makeStyles, withStyles } from '@mui/styles';

import IconButton from '@mui/material/IconButton';

import {APPEARANCE as ap} from '../appearance';

export default withStyles({
  root: {
    borderRadius: '0!important',
    backgroundColor: '#222!important',
    color: '#fff!important',
    fontSize: "15px!important",
    textTransform: "none!important",
    padding: "6px 12px!important",
    '&:hover': {
      backgroundColor: '#fd8bb5!important',
      color: '#fff',
  },
  '&:disabled': {
      backgroundColor: '#aaa!important',
  },
}})(IconButton);
  
