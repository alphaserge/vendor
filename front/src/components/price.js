import * as React from 'react';
import Box from '@mui/material/Box';

import { fined, computePrice } from "../functions/helper"

export default function Price(props) {

  const price = computePrice(props.product, 1000, false)
  const value = price.toLocaleString('ru-RU', {minimumFractionDigits: 2});

  return <Box sx={{ ml: "2px", color: (props.color ? props : "#222") }}>
      from $ {fined( value )} per meter
  </Box>
}
