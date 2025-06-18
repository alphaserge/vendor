import * as React from 'react';
import Box from '@mui/material/Box';

import {APPEARANCE as ap} from "../appearance"

export default function Property(props) {
  return <Box sx={{ 
    color: (props.color ? props : ap.COLOR), 
    fontFamily: ap.FONTFAMILY, 
    fontSize: (props.fontSize ? props : ap.FONTSIZE), 
    fontWeight: ap.FONTWEIGHT }}>{props.value}</Box>
}
