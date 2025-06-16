import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

export default function ItemName(props) {
  return <Box title={props.value} sx={{ 
    color: "#222", 
    //textAlign: "center", 
    fontFamily: "'Chiron Sung HK', 'Open-Sans', Arial, Inter, 'sans-serif'",
    fontSize: "26px", 
    fontWeight: "400",
    //letterSpacing: "1px",
    padding: "10px 10px 20px 0px" }}>{props.value}
    </Box>
         
}
