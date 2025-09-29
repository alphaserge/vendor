import { colors } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

export default function PageHeader(props) {
  return <Box title={props.value} sx={{ padding: "30px 0", fontSize: "18px", color: "#80398d" }}
    textAlign={!!props.textAlign ? props.textAlign : "none" } 
    
    >{props.value}
    </Box>
         
}
