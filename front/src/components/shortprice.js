import * as React from 'react';
import Box from '@mui/material/Box';

export default function ShortPrice(props) {
  return <Box sx={{ 
    color: "#333", 
    height: "40px",
    textAlign: "center",
    padding: "7px 10px 7px 10px",
  }}>{props.value}</Box>
}
