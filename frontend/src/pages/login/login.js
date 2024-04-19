import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import axios from 'axios'

import { stringToHash } from '../../functions/hash'
import config from "../../config.json"

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [vendorList, setVendorList] = useState([])
    const [vendor, setVendor] = useState("")
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

        // Check if email has an account associated with it
        checkAccountExists(accountExists => {
            // If yes, log in 
            if (accountExists)
                logIn()
            else
            // Else, ask user if they want to create a new account and if yes, then log in
                if (window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
                    signUp()
                }
        })        
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
                props.setEmail(email)
                navigate("/")
            } else {
                window.alert("Wrong email or password")
            }
        })
        .catch((error) => {
            window.alert("Wrong email or password")
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
            body: JSON.stringify({Email: email, PasswordHash: passwordhash})
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
        console.log('new vendor:' + event.target.value)
      };
    
      const VendorsData = () => {
        axios.get(config.api + '/Vendors')
        .then(function (res) {
          try {
            var result = res.data;
            console.log(result)
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

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Login</div>
        </div>
        <br />
        {/* <Button variant="contained">Hello world</Button> */}
        <Box sx={{ minWidth: 120 }}  >
            <FormControl fullWidth sx={{display: 'flex', gap: 2}} > 
                <InputLabel id="demo-simple-select-label">Company</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={vendor}
                    label="Company"
                    variant="outlined"
                    onChange={vendorChange}>
                    {vendorList.map((data) => (
                    <MenuItem key={data.id} value={data.id}>{data.vendorName}</MenuItem>
                ))}                    
                </Select>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            </FormControl>
        </Box>
        <br />
        <div className={"inputContainer"}>
            <input
                value={email}
                placeholder="Enter your email here"
                onChange={ev => setEmail(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                value={password}
                placeholder="Enter your password here"
                onChange={ev => setPassword(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Log in"} />
        </div>
    </div>
}

export default Login