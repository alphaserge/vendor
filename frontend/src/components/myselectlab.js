import { colors, Typography } from '@mui/material';
import * as React from 'react';

import Box from '@mui/material/Box';

import MySelect from './myselect';

import {APPEARANCE as ap} from '../appearance';

const labelStyle = { m: 0, ml: 0, mr: 0 }
const itemStyle1 = { width: "calc( 100% - 0px )", mt: 0, ml: 0, mr: 0, mb: 0 }
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MySelectProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function MySelectLab(props) {
  return <Box 
    sx={{ 
      display: "flex",
      flexDirection: "column",
      color: "#222", 
      width: !props.width ? "100px" : props.width, 
      fontFamily: ap.FONTFAMILY }}>
        <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>{props.label}</Typography>
        <MySelect 
              hideLabel={true}
              valueName={props.valueName}
              labelStyle={labelStyle}
              itemStyle={itemStyle1}
              disabled={props.disabled}
              MenuProps={MySelectProps}
              valueVariable={props.valueVariable}
              setValueFn={props.setValueFn}
              data={props.data}
            />
    </Box>
}
