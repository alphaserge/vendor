import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios'

import Copyright from '../copyright';
import config from "../../config.json"

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Confirm(props) {

  const [email, setEmail] = useState("")
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
      
  const handleSubmit = (event) => {
    event.preventDefault();
    //const data = new FormData(event.currentTarget);
  };

  const onButtonClick = () => {
    confirm()
  }
  
  // Log in a user using email and password
  const confirm = () => {

      axios.get(config.api + '/Auth/confirm?token=' + searchParams.get("token"))
      .then(function (r) {
        try {
              let d = {...props.data}
              d.loggedIn = true;
              d.user = r;
              props.setData(d)
          navigate("/success")
          //setVendorList(result)
        }
       catch (error) {
          navigate("/error")
          console.log(error)
        }
      })
      .catch (error => {
          navigate("/error")
          console.log(error)
      })
    }      

    useEffect(() => {
      //confirm()
    }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ mt: -3, mb: 0 }}>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 0, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Account confirmation
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <FormControl fullWidth > 
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={onButtonClick}
              sx={{ mt: 3, mb: 2 }} >
              Confirm your account
            </Button>
             </FormControl>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}