import * as React from 'react';
import Box from '@mui/material/Box';

import { fined, computePrice } from "../functions/helper"

export default function Price(props) {

  const price = computePrice(props.product, 1000, false)
  const value = !!price ? price.toLocaleString('ru-RU', {minimumFractionDigits: 2}) : "";

  return <Box sx={{ color: (!!props.color ? props.color : "#222"), padding: (!!props.padding ? props.padding : "0") }}>
      Price: from $ <b>{fined(value)}</b> per meter
  </Box>
}
