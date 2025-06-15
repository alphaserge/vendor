import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

export default function ItemName(props) {
  return <Box title={props.value} sx={{ 
    color: "#242424", 
    textAlign: "center", 
    fontFamily: "font-family: 'Open-Sans', Arial, Inter, 'sans-serif'",
    fontSize: "32px", 
    fontWeight: "300",
    padding: "0 10px 10px 10px" }}>{props.value}
    </Box>
         
}
