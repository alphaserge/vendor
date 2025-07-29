import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

import {APPEARANCE as ap} from '../appearance';

export default function PageHeader(props) {
  return <Box title={props.value} sx={{ 
    fontFamily: ap.FONTFAMILY,
    color: ap.PAGEHEADER.COLOR, 
    fontSize: ap.PAGEHEADER.FONTSIZE, 
    fontWeight: ap.PAGEHEADER.FONTWEIGHT,
    padding: "30px 0" }}
    textAlign={!!props.textAlign ? props.textAlign : "none" }
    >{props.value}
    </Box>
         
}
