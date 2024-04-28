import React from "react";

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        JSC Angelka Moscow
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}