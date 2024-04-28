import React from "react";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Copyright from '../copyright';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Success(props) {

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" >
        {/* <CssBaseline /> */}
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ mb: 3, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> 
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Account confirmation
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <FormControl fullWidth > 
            <p>Your account has been verified. In the future, use your email address and password to log into the site.</p>
            <Link href="/">Go to main page</Link>
             </FormControl>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}