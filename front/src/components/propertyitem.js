import * as React from 'react';
import Box from '@mui/material/Box';

export default function PropertyItem(props) {
  return <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", margin: "4px 0"}} >
            <Box component="span" className="item-label" sx={{ width: props.labelWidth ? props.labelWidth : "120px", flexShrink: 0 }}>{props.label}</Box>
            <Box component="span" className="item-value" 
              sx={{ 
                maxWidth: props.maxWidth? props.maxWidth: "320px", 
                width: props.width? props.width: "220px", 
                flexGrow: 1 }} title={props.value}>{props.value}</Box>
         </Box>
}
