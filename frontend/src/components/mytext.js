import { colors, Typography } from '@mui/material';
import * as React from 'react';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import {APPEARANCE as ap} from '../appearance';

export default function MyText(props) {
  return <Box
    sx={{ 
      display: "flex",
      flexDirection: "column",
      color: "#222", 
      width: !props.width ? "100px" : props.width, 
      //marginTop: "7px",
      fontFamily: ap.FONTFAMILY }}
      
      >
        <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>{props.label}</Typography>
        <TextField //label="Details"
            margin="normal"
            size="small" 
            label={""}
            sx={{marginTop: 0 }}
            //width={!props.width ? "100px" : props.width} 
            value={props.value}
            onChange={ev => { props.onChange(ev.target.value)}} 
            InputProps={{
              readOnly: !!props.readOnly ? props.readOnly : false,
            }}
            />
    </Box>
}
