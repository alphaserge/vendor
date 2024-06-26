import React from "react";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import Copyright from '../copyright';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Info(props) {

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container 
        component="main" 
        maxWidth="xs" 
        display='flex'
        //justifyContent='center'
        sx={{  }}>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Account confirmation
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <FormControl fullWidth > 
            <p>A letter has been sent to your email with an account activation link. Please check your email and activate your account.</p>
             </FormControl>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}