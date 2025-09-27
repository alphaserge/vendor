import * as React from 'react';
import Box from '@mui/material/Box';

import {toFixed2} from "../functions/helper"

export default function Price(props) {
  return <Box sx={{ ml: "2px", color: (props.color ? props : "#222") }}>
      from $ {toFixed2(props.price)} per meter
      {/* <span style={{ color: "#444"}}>Price: </span> from $ {toFixed2(props.price)} per meter */}
      </Box>
}
