import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

export default function ItemName(props) {
  return <Box title={props.value} sx={{ 
    color: "#242424", 
    textAlign: "center", 
    fontSize: "21px", 
    fontWeight: "600",
    padding: "20px 20px 40px 20px" }}>{props.value}
    </Box>
         
}
