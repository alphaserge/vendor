import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

import axios from 'axios'

import { stringToHash } from '../../functions/hash'
import config from "../../config.json"

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Register(props) {

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
  const [confirmPassword, setConfirmPassword] = useState("")
  const [vendorList, setVendorList] = useState([])
  const [vendor, setVendor] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  const [companyError, setCompanyError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [firstNameError, setFirstNameError] = useState("")
  
  
  const navigate = useNavigate();
      
  const onButtonClick = () => {

      setCompanyError("")
      setEmailError("")
      setPasswordError("")
      setConfirmPasswordError("")
      setFirstNameError("")

      if ("" === vendor) {
        setCompanyError("Please select a Company")
        return
      }

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

      if (password != confirmPassword) {
        setConfirmPasswordError("The passwords are different")
        return
      }

      if ("" === firstName) {
        setFirstNameError("Please enter a Your first name")
        return
      }

    signUp()
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
  const signUp = () => {

      let passwordhash = stringToHash(password)+''

      fetch("https://localhost:3080/Auth/signup", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            Email: email, 
            PasswordHash: passwordhash,
            VendorId: vendor,
            FirstName: firstName,
            LastName: lastName,
            Phone: phone
          })
      })
      .then(r => r.json())
      .then(r => {
          if (r.id >= 1) {
              localStorage.setItem("user", JSON.stringify({email, token: r.token}))
              props.setLoggedIn(true)
              props.setEmail(email)
              navigate("/")
          } else {
              window.alert("Wrong email or password")
          }
      })
  }

  /*useEffect(() => {
      fetch(config.api + '/Vendors')
        .then(response => response.json())
        .then(json => setVendors(json))
        .catch(error => console.error(error));
    }, []);*/

    const vendorChange = (event) => {
      setVendor(event.target.value)
    };
  
    const VendorsData = () => {
      axios.get(config.api + '/Vendors')
      .then(function (res) {
        try {
          var result = res.data;
          setVendorList(result)
        }
        catch (error) {
          console.log(error)
        }
      })
    }      

    useEffect(() => {
      VendorsData()
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
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <FormControl 
              fullWidth
              error={ companyError + emailError + passwordError + confirmPasswordError + firstNameError != "" }
              required > 
                <InputLabel 
                  id="demo-simple-select-label">
                  Your Company
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={vendor}
                  label="Your Company"
                  // variant="outlined"
                  onChange={vendorChange}>
                  { vendorList.map((data) => (
                    <MenuItem key={data.id} value={data.id}>{data.vendorName}</MenuItem>
                ))}                    
                </Select>
                <FormHelperText>{companyError}</FormHelperText>
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
            <TextField
              margin="normal"
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
              label="Your password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
            />
            <FormHelperText>{passwordError}</FormHelperText>
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              value={confirmPassword}
              onChange={ev => setConfirmPassword(ev.target.value)}
            />
            <FormHelperText>{confirmPasswordError}</FormHelperText>
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First name"
              id="firstName"
              value={firstName}
              onChange={ev => setFirstName(ev.target.value)}
            />
            <FormHelperText>{firstNameError}</FormHelperText>
            <TextField
              margin="normal"
              fullWidth
              name="lastName"
              label="Last name"
              id="lastName"
              value={lastName}
              onChange={ev => setLastName(ev.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              name="phone"
              label="Phone"
              id="phone"
              value={phone}
              onChange={ev => setPhone(ev.target.value)}
            />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={onButtonClick}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}