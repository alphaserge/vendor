import * as React from 'react';
import { Typography } from "@mui/material";

import Box from '@mui/material/Box';

export default function PageHeader(props) {
  return <Typography sx={{fontSize: "16px", fontWeight: 700, color: "#444", margin: "20px 0 20px", textAlign:(!!props.textAlign ? props.textAlign : "none") }} >{props.value}</Typography>
}
