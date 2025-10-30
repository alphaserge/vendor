import * as React from 'react';
import Box from '@mui/material/Box';

export default function ShortPrice(props) {
  
  const fontSize = !!props.fontSize ? props.fontSize : "14px"

  const value = props.value.toLocaleString('ru-RU', {minimumFractionDigits: 2});

  return <Box sx={{ 
    color: "#333", 
    height: "40px",
    alignContent: "center",
    justifyItems: "center",
    padding: "7px 10px 7px 10px",
    fontSize: fontSize
  }}><div>{value} $</div></Box>
}
