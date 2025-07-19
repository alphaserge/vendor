import * as React from 'react';
import Box from '@mui/material/Box';

import {APPEARANCE as ap} from "../appearance"

export default function ShortPrice(props) {
  return <Box sx={{ 
    color: "#333", 
    fontFamily: ap.FONTFAMILY, 
    fontSize: ap.FONTSIZE, 
    fontWeight: ap.FONTWEIGHT,
    backgroundColor: "#ddd",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    textAlign: "center",
    paddingTop: "7px",

    //padding: "10px 10px" 
  }}>{props.value}</Box>
}
