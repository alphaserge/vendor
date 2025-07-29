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
import styled from "styled-components";

import MainSection from '../../pages/home/mainsection';
import Footer from '../../pages/home/footer';
import PageHeader from '../../components/pageheader';
import StyledTextField from '../../components/styledtextfield';
import StyledButton from '../../components/styledbutton';

import { stringToHash } from '../../functions/hash'
import config from "../../config.json"
import { fromUrl } from "../../functions/helper";

import { APPEARANCE } from '../../appearance';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }

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
      fetch(config.api + "/Auth/check-account", {
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

      fetch(config.api + "/Auth", {
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
              let d = {...props.data}
              d.loggedIn = true;
              d.user = r;
              props.setData(d)
              localStorage.setItem("user", JSON.stringify(r));
              const ret = fromUrl("return")
              navigate("/" + ret)
          } else {
              window.alert("Wrong email or password")
          }
      })
      .catch((error) => {
          window.alert("Wrong email or password")
      })
  }

  const searchProducts = (param) => {
    //if (param.length > 2) {
      navigate("/?q=" + encodeURIComponent(param))
    //}
  }

  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />

      <MainSection
        searchProducts={searchProducts}
        data={props.data}/>

    <Box id="id0" sx={{ display: "flex", alignItems: "center", flexDirection: "column", pt: 4 }} className="center-content" >
    <Box sx={{ justifyContent: "flex-start", alignItems: "center", minHeight: 440 }} >
    <PageHeader value={"Welcome to the site"} textAlign="center"/>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FormControl 
             fullWidth 
             sx={{display: 'flex'}} > 
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Enter your email here"
              name="email"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              autoComplete="email"
              style={itemStyle}
              autoFocus
            />
            <FormHelperText>{emailError}</FormHelperText>
            <StyledTextField
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
              style={itemStyle}
            />
            <FormHelperText>{passwordError}</FormHelperText>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            </FormControl>
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 2, width: "80px"}}
              onClick={onButtonClick} >
              Log In
            </StyledButton>
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
       </Box>

    <Footer sx={{ mt: 2, mb: 2 }} />

    </ThemeProvider>
  );
}