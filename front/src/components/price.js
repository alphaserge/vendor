import * as React from 'react';
import Box from '@mui/material/Box';

import {APPEARANCE as ap} from "../appearance"
import {toFixed2} from "../functions/helper"

export default function Price(props) {
  return <Box sx={{ ml: "2px",
    color: (props.color ? props : ap.PRICE.COLOR), 
    fontFamily: ap.PRICE.FONTFAMILY, 
    fontSize: ap.PRICE.FONTSIZE, 
    fontWeight: ap.PRICE.FONTWEIGHT }}>
      from $ {toFixed2(props.price)} per meter
      {/* <span style={{ color: "#444"}}>Price: </span> from $ {toFixed2(props.price)} per meter */}
      </Box>
}
