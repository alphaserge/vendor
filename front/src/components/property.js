import * as React from 'react';
import Box from '@mui/material/Box';

export default function Property(props) {
  return <Box sx={{ padding: "4px 10px" }}>{props.value}</Box>
}
