import * as React from 'react';
import Box from '@mui/material/Box';

export default function Property(props) {
  const fontSize = !!props.fontSize ? props.fontSize : "14px"
  return <Box sx={{ padding: "0px 5px", fontSize: fontSize }}  >{props.value}</Box>
}
