import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormHelperText from '@mui/material/FormHelperText';

import axios from 'axios'

import Button from '@mui/material/Button';

import Copyright from '../copyright';
import config from "../../config.json"

import Header from './blog/Header';
import Footer from './blog/Footer';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 400, m: 2 }
const labelStyle = { m: 2 }

export default function AddProduct(props) {

    const navigate = useNavigate();

    const [productStyleList, setProductStyleList] = useState([])
    const [productStyle, setProductStyle] = useState("")
    
    const onButtonClick = () => {
        if (props.loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };
  
    const productStyleChange = (event) => {
      setProductStyle(event.target.value)
    };
  
    const productStylesData = () => {
      axios.get(config.api + '/ProductStyles')
      .then(function (res) {
        try {
          var result = res.data;
          setProductStyleList(result)
        }
       catch (error) {
          console.log(error)
        }
      })
      .catch (error => {
        console.log(error)
      })
    }      

    useEffect(() => {
      productStylesData()
    }, []);


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" />
        <main>
        <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Add product
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
          <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label"
                  size="small" 
                  sx={labelStyle} >
                  Product style
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small" 
                  value={productStyle}
                  label="Product style"
                  //variant="outlined"
                  sx = {itemStyle}
                  onChange={productStyleChange}>
                   { productStyleList.map((data) => (
                     <MenuItem key={data.id} value={data.id}>{data.styleName}</MenuItem>
                 ))}
                </Select>
                </FormControl>
                {/* <FormHelperText>{companyError}</FormHelperText> */}
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}

                <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label2"
                  size="small" 
                  sx={labelStyle} >
                  Product style
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label2"
                  id="demo-simple-select2"
                  size="small" 
                  value={productStyle}
                  label="Product style"
                  //variant="outlined"
                  sx = {itemStyle}
                  onChange={productStyleChange}>
                   { productStyleList.map((data) => (
                     <MenuItem key={data.id} value={data.id}>{data.styleName}</MenuItem>
                 ))}
                </Select>
                </FormControl>
                {/* <FormHelperText>{companyError}</FormHelperText> */}
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}

          </Grid>
          </Box>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}
