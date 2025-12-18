import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

export default function ItemName(props) {
  return <Box title={props.value} sx={{ 
    color: "#222", 
    fontSize: "17px", 
    fontWeight: "600",
    //letterSpacing: "1px",
    padding: "0" }}>{props.value}
    </Box>
         
}
