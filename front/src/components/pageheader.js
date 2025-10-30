import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

export default function PageHeader(props) {
  return <Box title={props.value} sx={{ padding: "10px 0", fontSize: "16px", color: "#222" }}
    textAlign={!!props.textAlign ? props.textAlign : "none" } 
    
    >{props.value}
    </Box>
         
}
