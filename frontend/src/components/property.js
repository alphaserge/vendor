import * as React from 'react';
import Box from '@mui/material/Box';

import {APPEARANCE as ap} from "../appearance"

export default function Property(props) {
  return <Box sx={{ 
    color: (props.color ? props.color : ap.COLOR), 
    fontFamily: ap.FONTFAMILY, 
    fontSize: (props.fontSize ? props.fontSize : ap.FONTSIZE), 
    justifyContent: (props.justifyContent ? props.justifyContent : "begin"), 
    textAlign: (props.textAlign ? props.textAlign : "left"),
    fontWeight: ap.FONTWEIGHT,
    padding: "4px 10px" }}>{props.value}</Box>
}
