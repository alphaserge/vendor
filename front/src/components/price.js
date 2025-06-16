import * as React from 'react';
import Box from '@mui/material/Box';

import {APPEARANCE as ap} from "../appearance"
import {toFixed2} from "../functions/helper"

export default function Price(props) {
  return <Box sx={{ color: ap.PRICE.COLOR, fontFamily: ap.PRICE.FONTFAMILY, fontSize: ap.PRICE.FONTSIZE, fontWeight: ap.PRICE.FONTWEIGHT }}>From <b>$ {toFixed2(props.price)}</b> per meter</Box>
}
