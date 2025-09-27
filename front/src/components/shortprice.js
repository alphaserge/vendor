import * as React from 'react';
import Box from '@mui/material/Box';

export default function ShortPrice(props) {
  return <Box sx={{ 
    color: "#333", 
    backgroundColor: "#ddd",
    borderRadius: "15%",
    width: "40px",
    height: "40px",
    textAlign: "center",
    paddingTop: "7px",

    //padding: "10px 10px" 
  }}>{props.value}</Box>
}
