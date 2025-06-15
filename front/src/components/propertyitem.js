import * as React from 'react';
import Box from '@mui/material/Box';

export default function PropertyItem(props) {
  return <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-end", margin: "4px 0"}} >
            <Box component="span" className="item-label" sx={{ width: props.labelWidth ? props.labelWidth : "140px" }}>{props.label}</Box>
            <Box component="span" className="item-value" sx={{ maxWidth: props.maxWidth }} title={props.value}>{props.value}</Box>
         </Box>
}
