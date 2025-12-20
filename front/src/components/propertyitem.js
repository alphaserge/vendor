import * as React from 'react';
import Box from '@mui/material/Box';

export default function PropertyItem(props) {
  return <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", margin: "4px 0"}} >
            <Box component="span" className="item-label">{props.label}</Box>
            <Box component="div" className="item-dots" ></Box>
            <Box component="span" className="item-value" 
              sx={{ 
                maxWidth: props.maxWidth? props.maxWidth: "320px", 
                width: props.width? props.width: "280px" 
                 }} title={props.value}>{!!props.value ? props.value : "none"}</Box>
         </Box>
}
