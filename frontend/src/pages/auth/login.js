import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Copyright from '../copyright';
import { stringToHash } from '../../functions/hash'

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login(props) {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  
  const navigate = useNavigate();
      
  const onButtonClick = () => {

      // Set initial error values to empty
      setEmailError("")
      setPasswordError("")

      // Check if the user has entered both fields correctly
      if ("" === email) {
          setEmailError("Please enter your email")
          return
      }

      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
          setEmailError("Please enter a valid email")
          return
      }

      if ("" === password) {
          setPasswordError("Please enter a password")
          return
      }

      if (password.length < 7) {
          setPasswordError("The password must be 8 characters or longer")
          return
      }
      logIn()
  }

  // Call the server API to check if the given email ID already exists
  const checkAccountExists = (callback) => {
      fetch("https://localhost:3080/Auth/check-account", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({email})
      })
      .then(r => r.json())
      .then(r => {
          callback(r?.userExists)
      })
  }

  // Log in a user using email and password
  const logIn = () => {

      let passwordHash = stringToHash(password)+''

      fetch("https://localhost:3080/Auth/auth", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({email, passwordHash})
      })
      //.then(r => r.json())
      .then(response => response.ok
          ? response.json()
          : Promise.reject(response)  //throw if not 200-OK
      )
      .then(r => {
          if (r.token != '') {
              localStorage.setItem("user", JSON.stringify({email, token: r.token}))
              props.setLoggedIn(true)
              props.setUser(r)
              navigate("/")
          } else {
              window.alert("Wrong email or password")
          }
      })
      .catch((error) => {
          window.alert("Wrong email or password")
        })
  }

  /*useEffect(() => {
      fetch(config.api + '/Vendors')
        .then(response => response.json())
        .then(json => setVendors(json))
        .catch(error => console.error(error));
    }, []);

  useEffect(() => {
      VendorsData()
    }, []);*/

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }} >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <FormControl 
             fullWidth 
             sx={{display: 'flex'}} > 
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Enter your email here"
              name="email"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              autoComplete="email"
              autoFocus
            />
            <FormHelperText>{emailError}</FormHelperText>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Enter your password here"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
            />
            <FormHelperText>{passwordError}</FormHelperText>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={onButtonClick}
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}