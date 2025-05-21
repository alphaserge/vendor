import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

export default function ItemName(props) {
  return <Box title={props.value} sx={{ 
    color: "#242424", 
    textAlign: "center", 
    fontSize: "23px", 
    fontWeight: "500",
    padding: "40px 25px 20px 20px" }}>{props.value}
    </Box>
         
}
